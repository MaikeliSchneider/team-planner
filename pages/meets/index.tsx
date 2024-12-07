"use server";
import { getSession } from "next-auth/react";
import { Button } from "@nextui-org/button";
import { Plus } from "lucide-react";
import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import { useFieldArray, useForm } from "react-hook-form";

import DefaultLayout from "@/components/default";
import TableComponent from "@/components/table";

const timeOfDays = [
  { key: "Manhã", label: "Manhã" },
  { key: "Tarde", label: "Tarde" },
  { key: "Noite", label: "Noite" },
];

const weekDays = [
  { key: "Segunda-feira", label: "Segunda-feira" },
  { key: "Terça-feira", label: "Terça-feira" },
  { key: "Quarta-feira", label: "Quarta-feira" },
  { key: "Quinta-feira", label: "Quinta-feira" },
  { key: "Sexta-feira", label: "Sexta-feira" },
  { key: "Sábado", label: "Sábado" },
  { key: "Domingo", label: "Domingo" },
];

const columns = [
  { key: "name", label: "Nome" },
  { key: "timeOfDay", label: "Horário" },
  { key: "weekDay", label: "Dia da semana" },
  { key: "local", label: "Local" },
];

type MeetsPageProps = {
  user: {
    name: string;
    email: string;
    id: string;
  };
  meets: any[];
  userIsAdmin: boolean;
};

export default function MeetsPage({
  user,
  meets,
  userIsAdmin,
}: MeetsPageProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { register, handleSubmit, watch, reset, control } = useForm({
    defaultValues: {
      form: [{ question: "", type: "string" }], // Inicializa com um campo
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "form", // Nome do array no formulário
  });

  const onSubmit = async (data: any) => {
    try {
      const res = await fetch("/api/meet", {
        method: "POST",
        body: JSON.stringify({ ...data, userId: user.id }),
      });

      console.log("🚀 ~ res => ", res);
    } catch (error) {
      console.log("🚀 ~ error => ", error);
    }
  };

  return (
    <DefaultLayout user={user}>
      <h1 className="text-[3rem] lg:text-5xl font-semibold tracking-tight">
        Reuniões
        <Button
          isIconOnly
          className="ml-auto"
          radius="md"
          size="md"
          style={{ marginLeft: "10px", marginTop: "-10px" }}
          variant="faded"
          onPress={onOpen}
        >
          <Plus size={20} />
        </Button>
      </h1>
      {/* <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10"> */}
      <div className="mt-10">
        <TableComponent columns={columns} rows={meets} />
      </div>
      <Modal
        isOpen={isOpen}
        placement="top-center"
        scrollBehavior="inside"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Criar reunião
              </ModalHeader>
              <form
                className="flex flex-col gap-4 h-[300px]"
                onSubmit={handleSubmit(onSubmit)}
              >
                <ModalBody>
                  <Input
                    label="Nome"
                    placeholder="Nome da reunião"
                    variant="bordered"
                    {...register("name", { required: true })}
                  />
                  <Select
                    // className="max-w-xs"
                    label="Período do dia"
                    placeholder="Selecione o período do dia"
                    variant="bordered"
                    {...register("timeOfDay", { required: true })}
                  >
                    {timeOfDays.map((time) => (
                      <SelectItem key={time.key}>{time.label}</SelectItem>
                    ))}
                  </Select>
                  <Select
                    // className="max-w-xs"
                    label="Dia da semana"
                    placeholder="Selecione o dia da reunião"
                    variant="bordered"
                    {...register("weekDay", { required: true })}
                  >
                    {weekDays.map((time) => (
                      <SelectItem key={time.key}>{time.label}</SelectItem>
                    ))}
                  </Select>
                  <Input
                    label="Nome"
                    placeholder="Local da reunião"
                    variant="bordered"
                    {...register("local", { required: false })}
                  />
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      style={{
                        marginBottom: "10px",
                        width: "80%",
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <Input
                        label="Pergunta"
                        variant="bordered"
                        {...register(`form.${index}.question`, {
                          required: true,
                        })}
                        placeholder={`Pergunta ${index + 1}`}
                        style={{ marginRight: "10px" }}
                      />
                      <Button
                        className="mt-2 ml-5"
                        color="danger"
                        variant="solid"
                        onClick={() => remove(index)}
                      >
                        Remover
                      </Button>
                    </div>
                  ))}

                  <Button
                    color="primary"
                    style={{ marginBottom: "10px" }}
                    variant="bordered"
                    onClick={() => append({ question: "", type: "string" })} // Adiciona uma nova pergunta vazia
                  >
                    + Adicionar Pergunta
                  </Button>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="flat"
                    onPress={() => {
                      onClose(), reset();
                    }}
                  >
                    Fechar
                  </Button>
                  <Button
                    color="primary"
                    type="submit"
                    onPress={() => {
                      onClose(), watch();
                    }}
                  >
                    Criar reunião
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </DefaultLayout>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  const userIsAdmin = !!(session?.user as any)?.companies?.find(
    (company: any) => company.isAdmin === true,
  );

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  const user = session.user as any;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const meets =
    (await fetch(`${baseUrl}/api/meet`, {
      method: "PATCH",
      body: JSON.stringify({ userId: user.id }),
    })
      .then(async (result) => {
        const response = await result.json();

        return response.meets;
      })
      .catch((error) => {
        console.error("Falha na request: ", error.message);
      })) || [];

  return {
    props: {
      user,
      meets,
      userIsAdmin,
    },
  };
}
