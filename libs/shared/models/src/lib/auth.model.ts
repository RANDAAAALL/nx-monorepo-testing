
export interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (data: { user: string; pass: string }) => void;
  title: string;
  backLink?: string;
}