function LayoutAuth({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="container">{children}</main>;
}

export default LayoutAuth;
