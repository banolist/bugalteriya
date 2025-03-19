import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Схема валидации с использованием Zod
const operationSchema = z.object({
  date: z.string().min(1, "Date is required"),
  amount: z.number().min(0, "Amount must be positive"),
  operationType: z.string().min(1, "Operation type is required"),
  productId: z.number().min(1, "Product ID must be positive"),
});

type FinancialOperation = z.infer<typeof operationSchema>;

interface CreateOperationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FinancialOperation) => void;
}

export const CreateOperationDialog: React.FC<CreateOperationDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FinancialOperation>({
    resolver: zodResolver(operationSchema),
  });

  const handleFormSubmit: SubmitHandler<FinancialOperation> = (data) => {
    onSubmit(data);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create New Operation</h2>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Date Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              {...register("date", { required: true })}
              className="input input-bordered w-full"
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
            )}
          </div>

          {/* Amount Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input
              type="number"
              step="0.01"
              {...register("amount", { valueAsNumber: true })}
              className="input input-bordered w-full"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Operation Type Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Operation Type
            </label>
            <select
              {...register("operationType")}
              className="select select-bordered w-full"
            >
              <option value="">Select type</option>
              <option value="Purchase">Purchase</option>
              <option value="Sale">Sale</option>
              <option value="Refund">Refund</option>
            </select>
            {errors.operationType && (
              <p className="text-red-500 text-sm mt-1">
                {errors.operationType.message}
              </p>
            )}
          </div>

          {/* Product ID Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Product ID</label>
            <input
              type="number"
              {...register("productId", { valueAsNumber: true })}
              className="input input-bordered w-full"
            />
            {errors.productId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.productId.message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              закрыть
            </button>
            <button type="submit" className="btn btn-primary">
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOperationDialog;
