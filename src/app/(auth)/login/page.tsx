"use server";
import LoginForm from "@/components/auth/login-form";
type LoginPageProps = {
  searchParams?: Promise<{
    callbackUrl?: string;
  }>;
};
async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackUrl = params?.callbackUrl || "/workspace";
  return (
    <div className="hero">
      <div className="hero-content justify-center min-h-screen">
        <LoginForm searchParam={callbackUrl} />
      </div>
    </div>
  );
}

export default LoginPage;
