import { Contact } from "@/services/contacts/domain/contact";
import ContactCard from "./contact-card";

interface ContactListProps {
  title: string;
  contacts: Contact[];
}

export default function ContactList({ title, contacts }: ContactListProps) {
  if (contacts.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-2xl">{title}</h2>
      </div>
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
        {contacts.map((contact) => (
          <ContactCard
            key={contact.id}
            id={contact.id}
            name={contact.name}
            imageUrl={contact.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}
