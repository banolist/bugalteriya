import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "~/context/AuthContext";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDatabase } from "~/context/databaseContext";

// Схема валидации с использованием zod
const loginSchema = z.object({
  login: z.string().min(1, "Логин обязателен"), // Логин должен быть не пустым
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"), // Пароль должен быть не менее 6 символов
});

// Тип данных формы на основе схемы
type LoginFormData = z.infer<typeof loginSchema>;

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const auth = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const db = useDatabase();

  // useEffect(() => {
  //   try {
  //     createDatabase().users.getByLogin("root");
  //   } catch (error) {
  //     console.error("get root user", error);
  //   }
  // }, []);

  // Обработчик отправки формы
  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      if (data.login != "root") {
        const user = await db.users.getByLogin(data.login);
        if (user.password !== data.password) {
          throw new Error("password err");
        }
        // Пример авторизации
        await auth.loginWithSessionID(user.username); // Используем логин для авторизации
      } else {
        console.log("test");
        if (data.password != "123456") {
          throw new Error("password err");
        }
        await auth.loginWithSessionID("root"); // Используем логин для авторизации
      }
      navigate({ to: "/app" }); // Переход на другую страницу
    } catch (error) {
      console.error("login", error);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="rounded-2xl bg-base-200 w-fit px-8 py-5 items-center">
        <div className="text-4xl text-center mb-5">вход</div>
        <form onSubmit={handleSubmit(onSubmit)} className="gap-2 flex flex-col">
          <input
            className="input"
            placeholder="Логин"
            type="text"
            {...register("login")} // Регистрируем поле в react-hook-form
          />
          {errors.login && (
            <span className="text-red-500">{errors.login.message}</span>
          )}

          <input
            className="input"
            placeholder="Пароль"
            type="password"
            {...register("password")} // Регистрируем поле в react-hook-form
          />
          {errors.password && (
            <span className="text-red-500">{errors.password.message}</span>
          )}

          <button type="submit" className="btn btn-primary">
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}
