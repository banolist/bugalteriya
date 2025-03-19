import { useForm, SubmitHandler, DefaultValues, Path } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
interface GenericDialogProps<
  T extends Record<string, unknown>,
  K = unknown | HasId,
> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: T & { id?: string }) => Promise<void>;
  schema: z.ZodSchema<T>;
  defaultValues?: Partial<T>;
  fields: FieldDialog<T, K>[];
}
export interface FieldDialog<
  T extends Record<string, unknown>,
  K = unknown | HasId,
> {
  key: keyof T;
  label: string;
  type: "text" | "number" | "date" | "select";
  options?: {
    accessLabel?: (v: K) => string;
    accessValue?: (v: K) => any;
    options: K[]; // Опции для выбора связанных структур
  };
}

interface HasId {
  id: any;
}

const GenericDialog = <T extends Record<string, any>, K>({
  isOpen,
  onClose,
  onSubmit,
  schema,
  defaultValues,
  fields,
}: GenericDialogProps<T, K>) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });
  useEffect(() => {
    console.log("Form errors:", errors); // Вывод всех ошибок
  }, [errors]);

  const handleFormSubmit: SubmitHandler<T> = async (data) => {
    console.log("Form Data:", data);
    await onSubmit(data);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="rounded-lg bg-base-100 p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create New Entry</h2>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {fields.map((field) => (
            <div key={field.key.toString()} className="mb-4">
              <label className="block text-sm font-medium mb-2">
                {field.label}
              </label>
              {field.type === "select" && field.options ? (
                <select
                  {...register(field.key as Path<T>)}
                  className="select select-bordered w-full"
                >
                  <option value="">{field.label}</option>
                  {field.options.options?.map((option, index) => (
                    <option
                      key={index}
                      value={
                        field.options?.accessValue
                          ? field.options.accessValue(option)
                          : (option as HasId).id
                      }
                    >
                      {field.options?.accessLabel
                        ? field.options.accessLabel(option)
                        : (option as any).name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  {...register(field.key as Path<T>, {
                    valueAsNumber: field.type == "number",
                  })}
                  className="input input-bordered w-full"
                />
              )}
              {errors[field.key] && (
                <p className="text-red-500 text-sm mt-1">
                  {(errors[field.key] as any)?.message}
                </p>
              )}
            </div>
          ))}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenericDialog;
