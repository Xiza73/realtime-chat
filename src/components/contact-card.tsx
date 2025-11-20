import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Contact } from "@/services/contacts/domain/contact";
import UserAvatar from "./user-avatar";
import { GoToChatButton } from "./go-to-chat-button";

export default function ContactCard({ id, name, imageUrl }: Contact) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between gap-2">
          {name}
          <UserAvatar imageUrl={imageUrl} name={name} />
        </CardTitle>
      </CardHeader>
      <CardFooter className="gap-2">
        <GoToChatButton
          contactId={id}
          variant="outline"
          className="grow"
          size="sm"
        >
          Chatear
        </GoToChatButton>
      </CardFooter>
    </Card>
  );
}
