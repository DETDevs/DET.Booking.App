const LoginPage = () => (
  <div className="flex items-center justify-center h-screen">
    <form className="w-[320px] space-y-4 bg-white p-6 shadow rounded">
      <h1 className="text-xl font-semibold text-center">Login</h1>
      <input type="email" placeholder="Email" className="input w-full" />
      <input type="password" placeholder="Password" className="input w-full" />
      <button type="submit" className="btn-primary w-full">
        Sign in
      </button>
    </form>
  </div>
);

export default LoginPage;
