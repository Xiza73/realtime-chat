"use server";

import z from "zod";
import { createRoomSchema } from "../schemas/rooms";
import { getCurrentUser } from "../lib/getCurrentUser";
import { redirect } from "next/navigation";
import { createAdminClient } from "../server/create-admin-client";

export async function createRoom(unsafeData: z.infer<typeof createRoomSchema>) {
  const { success, data } = createRoomSchema.safeParse(unsafeData);

  if (!success) {
    return { error: true, message: "Datos inválidos" };
  }

  const user = await getCurrentUser();
  if (user == null) {
    return { error: true, message: "Usuario no autenticado" };
  }

  const supabase = createAdminClient();

  const { data: room, error: roomError } = await supabase
    .from("chat_room")
    .insert({ name: data.name, is_public: data.isPublic })
    .select("id")
    .single();

  if (roomError || room == null) {
    return { error: true, message: "Error al crear sala" };
  }

  const { error: membershipError } = await supabase
    .from("chat_room_member")
    .insert({ chat_room_id: room.id, member_id: user.id });

  if (membershipError) {
    console.error(membershipError);
    return { error: true, message: "Error al agregar usuario a la sala" };
  }

  redirect(`/rooms/${room.id}`);
}

export async function createPVPChatRoom(contactId: string) {
  const user = await getCurrentUser();
  if (user == null) {
    return { error: true, message: "Usuario no autenticado" };
  }

  const supabase = createAdminClient();

  const { data: room, error: createRoomError } = await supabase
    .from("chat_room")
    .insert({ name: "Chat privado", is_pvp: true, is_public: false })
    .select("id")
    .single();

  if (createRoomError || room == null) {
    return { error: true, message: "Error al crear sala" };
  }

  const { error: membershipContactError } = await supabase
    .from("chat_room_member")
    .insert({ chat_room_id: room.id, member_id: contactId });

  if (membershipContactError) {
    console.error(membershipContactError);
    return { error: true, message: "Error al agregar usuario a la sala" };
  }

  const { error: membershipUserError } = await supabase
    .from("chat_room_member")
    .insert({ chat_room_id: room.id, member_id: user.id });

  if (membershipUserError) {
    console.error(membershipUserError);
    return { error: true, message: "Error al agregar usuario a la sala" };
  }

  redirect(`/rooms/${room.id}`);
}

export async function addUserToRoom({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) {
  const currentUser = await getCurrentUser();
  if (currentUser == null) {
    return { error: true, message: "Usuario no autenticado" };
  }

  const supabase = createAdminClient();

  const { data: roomMembership, error: roomMembershipError } = await supabase
    .from("chat_room_member")
    .select("member_id")
    .eq("chat_room_id", roomId)
    .eq("member_id", currentUser.id)
    .single();

  if (roomMembershipError || !roomMembership) {
    return { error: true, message: "El usuario no está en la sala" };
  }

  const { data: userProfile } = await supabase
    .from("user_profile")
    .select("id")
    .eq("id", userId)
    .single();

  if (userProfile == null) {
    return { error: true, message: "Usuario no encontrado" };
  }

  const { data: existingMembership } = await supabase
    .from("chat_room_member")
    .select("member_id")
    .eq("chat_room_id", roomId)
    .eq("member_id", userProfile.id)
    .single();

  if (existingMembership) {
    return { error: true, message: "El usuario ya está en la sala" };
  }

  const { error: insertError } = await supabase
    .from("chat_room_member")
    .insert({ chat_room_id: roomId, member_id: userProfile.id });

  if (insertError) {
    return { error: true, message: "Error al agregar usuario a la sala" };
  }

  return { error: false, message: "Usuario agregado a la sala exitosamente" };
}

export async function getPVPChatRoom(contactId: string) {
  const user = await getCurrentUser();
  if (user == null) {
    return { error: true, message: "Usuario no autenticado" };
  }

  const supabase = createAdminClient();

  const { data: userChatRooms, error: userChatRoomsError } = await supabase
    .from("chat_room_member")
    .select("chat_room_id")
    .eq("member_id", contactId);

  if (userChatRoomsError) {
    return { error: true, message: "Error al obtener el chat" };
  }

  const { data: contactChatRooms, error: contactChatRoomsError } =
    await supabase
      .from("chat_room_member")
      .select("chat_room_id")
      .eq("member_id", user.id);

  if (contactChatRoomsError) {
    return { error: true, message: "Error al obtener el chat" };
  }

  const sameRooms = userChatRooms.filter((room) =>
    contactChatRooms.some((cRoom) => cRoom.chat_room_id === room.chat_room_id)
  );

  const { data: rooms, error: roomsError } = await supabase
    .from("chat_room")
    .select("id, name, is_pvp")
    .eq("is_pvp", true)
    .in(
      "id",
      sameRooms.map((room) => room.chat_room_id)
    )
    .limit(1);

  if (roomsError) {
    return { error: true, message: "Error al obtener el chat" };
  }

  const roomId = rooms[0]?.id ? rooms[0].id : null;

  return { error: false, message: "Chat obtenido con éxito", roomId };
}
