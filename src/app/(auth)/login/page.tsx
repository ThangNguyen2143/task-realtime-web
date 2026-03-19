"use server";
import LoginForm from "@/components/auth/login-form";

async function LoginPage() {
  return (
    <div className="hero">
      <div className="hero-content text-center">
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;
