interface Props {
    children: React.ReactNode;
  }
  
  export const SectionTitle = ({ children }: Props) => {
    return (
      <div className="relative text-center mb-2 md:mb-6">
        <div className="flex justify-center mb-2">
          <img
            src="/assets/pawprint.png"
            alt="pawprint"
            className="w-5 h-5 opacity-30 mr-1 animate-bounce"
          />
          <img
            src="/assets/pawprint.png"
            alt="pawprint"
            className="w-5 h- opacity-30 ml-1 animate-bounce delay-150"
          />
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-pink-600 tracking-wide drop-shadow-sm">
          {children}
        </h2>
        <div className="mt-2 w-24 h-1 bg-pink-500 mx-auto rounded-full"></div>
      </div>
    );
  };
  