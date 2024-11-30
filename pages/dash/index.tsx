import { title } from "@/components/primitives";
import TableComponent from "@/components/table";
import DefaultLayout from "@/layouts/default";

const rows = [
  {
    key: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "555-123-4567",
  },
  {
    key: "2",
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "555-123-4567",
  },
  {
    key: "3",
    name: "Bob Smith",
    email: "bob@example.com",
    phone: "555-123-4567",
  },
];

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
];

const user = {
  name: "John Doe",
};

export default function DocsPage() {
  console.log(title());

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1
            className={
              "tracking-tight inline-block font-semibold text-[2.3rem] lg:text-5xl leading-9"
            }
          >{`Seja bem vindo ${user.name}`}</h1>
        </div>
        <TableComponent columns={columns} rows={rows} />
      </section>
    </DefaultLayout>
  );
}
