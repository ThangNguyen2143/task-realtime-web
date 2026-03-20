"use server";
import RegisterForm from "@/components/auth/register-form";

async function RegisterPage() {
  return (
    <div className="hero">
      <div className="hero-content justify-center min-h-screen">
        <RegisterForm />
      </div>
    </div>
  );
}

export default RegisterPage;
