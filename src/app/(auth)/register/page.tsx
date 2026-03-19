"use server";
import RegisterForm from "@/components/auth/register-form";

async function RegisterPage() {
  return (
    <div className="hero">
      <div className="hero-content text-center">
        <RegisterForm />
      </div>
    </div>
  );
}

export default RegisterPage;
