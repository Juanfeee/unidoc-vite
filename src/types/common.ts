
// Definición del tipo SuccessCallback en src/types/common.ts

// Este tipo puede ser importado y utilizado en cualquier componente que necesite una función de callback para manejar el éxito de una operación.
export type SuccessCallback<T = any> = {
  onSuccess: (nuevo?: T) => void;
};