import {
  Tabs,
  Tab,
  Input,
  Link,
  Button,
  Card,
  CardBody,
} from "@nextui-org/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/router";

import DefaultLayout from "@/layouts/default";

export default function DocsPage() {
  const [selected, setSelected] = useState<React.Key>("login");
  const { register, handleSubmit, watch, reset } = useForm();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    if (selected === "login") {
      try {
        const reponse = await axios.post("/api/auth", data);

        localStorage.setItem("accessToken", reponse.data.accessToken);
        localStorage.setItem("refreshToken", reponse.data.refreshToken);
        router.push("/");
      } catch (error) {
        console.log("🚀 ~ error => ", error);
      }
    } else {
      const { companyId, isAdmin } = router.query;

      try {
        const response = await axios.post("/api/users", {
          ...data,
          companyId,
          isAdmin: isAdmin === "true",
        });

        if (response.data.success) {
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);
          router.push("/");
        }
      } catch (error) {
        console.log("🚀 ~ error => ", error);
      }
    }
  };

  const onSelectionChange = (key: React.Key) => {
    reset();
    setSelected(key);
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <div className="flex w-full justify-center">
            <Card
              className={`max-w-full w-[340px] h-[${selected === "login" ? 300 : 400}px]`}
            >
              <CardBody className="overflow-hidden">
                <Tabs
                  fullWidth
                  aria-label="Tabs form"
                  selectedKey={selected as any}
                  size="md"
                  onSelectionChange={onSelectionChange}
                >
                  <Tab key="login" title="Login">
                    <form className="flex flex-col gap-4">
                      <Input
                        {...register("email", { required: true })}
                        isRequired
                        label="Email"
                        placeholder="Insira seu email"
                        type="email"
                      />
                      <Input
                        {...register("password", { required: true })}
                        isRequired
                        label="Senha"
                        placeholder="Insira sua senha"
                        type="password"
                      />
                      <p className="text-center text-small">
                        Ainda não tem uma conta?{" "}
                        <Link size="sm" onPress={() => setSelected("sign-up")}>
                          Criar
                        </Link>
                      </p>
                      <div className="flex gap-2 justify-end">
                        <Button
                          fullWidth
                          color="primary"
                          type="submit"
                          onClick={(e) => {
                            e.preventDefault();
                            onSubmit(watch());
                          }}
                        >
                          Login
                        </Button>
                      </div>
                    </form>
                  </Tab>
                  <Tab key="sign-up" title="Criar conta">
                    <form
                      className="flex flex-col gap-4 h-[300px]"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <Input
                        {...register("name", { required: true })}
                        isRequired
                        label="Nome"
                        placeholder="Insira seu nome"
                        type="name"
                      />
                      <Input
                        {...register("email", { required: true })}
                        isRequired
                        label="Email"
                        placeholder="Insira seu email"
                        type="email"
                      />
                      <Input
                        {...register("password", { required: true })}
                        isRequired
                        label="Senha"
                        placeholder="Insira sua senha"
                        type="password"
                      />
                      <p className="text-center text-small">
                        Já tem uma conta?{" "}
                        <Link size="sm" onPress={() => setSelected("login")}>
                          Fazer login
                        </Link>
                      </p>
                      <div className="flex gap-2 justify-end">
                        <Button
                          fullWidth
                          color="primary"
                          type="submit"
                          onClick={(e) => {
                            e.preventDefault();
                            onSubmit(watch());
                          }}
                        >
                          Cadastrar
                        </Button>
                      </div>
                    </form>
                  </Tab>
                </Tabs>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
