import { cn } from "@/shared/lib/utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, ChevronsLeft, ChevronsRight } from "lucide-react";
import { SimpleTooltip } from "./SimpleTooltip";
import { Link, useLocation } from "react-router-dom";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined,
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebar:open");
      return saved === "true";
    }
    return false;
  });

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  React.useEffect(() => {
    if (openProp === undefined) {
      localStorage.setItem("sidebar:open", String(openState));
    }
  }, [openState, openProp]);

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (
  props: React.ComponentProps<typeof motion.div> & {
    children?: React.ReactNode;
  },
) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div> & {
  children?: React.ReactNode;
}) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-full px-4 py-4 hidden md:flex md:flex-col bg-white dark:bg-neutral-800 border-r border-gray-100 dark:border-neutral-700 shrink-0 relative overflow-hidden transition-colors duration-300",
        className,
      )}
      animate={{
        width: animate ? (open ? "260px" : "60px") : "260px",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      {...props}
    >
      {children}

      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full shrink-0",
          "bg-gray-100 dark:bg-neutral-700",
          "hover:bg-gray-200 dark:hover:bg-neutral-600",
          "text-gray-500 dark:text-neutral-400",
          "transition-colors duration-200",
          "mt-auto self-center cursor-pointer",
        )}
        aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
      >
        {open ? <ChevronsLeft size={16} /> : <ChevronsRight size={16} />}
      </button>
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-white dark:bg-neutral-800 w-full",
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <Menu
            className="text-neutral-800 dark:text-neutral-200 cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={cn(
                "fixed top-0 left-0 h-full w-3/4 max-w-xs bg-white dark:bg-neutral-800 p-4 z-50 flex flex-col",
                className,
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-medium text-neutral-800 dark:text-neutral-200">
                  Menu
                </span>
                <X
                  className="text-neutral-800 dark:text-neutral-200 cursor-pointer"
                  onClick={() => setOpen(false)}
                />
              </div>
              <nav className="flex flex-col gap-3">{children}</nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  activeColor,
  ...props
}: {
  link: Links;
  className?: string;
  activeColor?: string;
}) => {
  const { open, animate } = useSidebar();
  const location = useLocation();

  const isActive =
    link.href === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(link.href);

  const activeBg = activeColor ? `${activeColor}15` : undefined;
  const activeTextColor = activeColor ?? "#6366f1";

  return (
    <SimpleTooltip content={link.label} enabled={!open}>
      <Link
        to={link.href}
        className={cn(
          "flex items-center justify-start gap-3 group/sidebar py-2.5 rounded-xl px-2 transition-all duration-200 w-full",
          isActive
            ? ""
            : "hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-600 dark:text-neutral-400",
          className,
        )}
        style={
          isActive
            ? { backgroundColor: activeBg, color: activeTextColor }
            : undefined
        }
        {...props}
      >
        <span className="shrink-0">{link.icon}</span>

        <motion.span
          animate={{
            display: animate
              ? open
                ? "inline-block"
                : "none"
              : "inline-block",
            opacity: animate ? (open ? 1 : 0) : 1,
          }}
          className={cn(
            "text-sm font-medium whitespace-pre inline-block !p-0 !m-0",
            isActive ? "font-semibold" : "text-gray-700 dark:text-neutral-300",
          )}
          style={isActive ? { color: activeTextColor } : undefined}
        >
          {link.label}
        </motion.span>

        {isActive && (
          <motion.div
            layoutId="sidebar-active-pill"
            className="absolute left-0 w-[3px] rounded-r-full h-6"
            style={{ backgroundColor: activeTextColor }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </Link>
    </SimpleTooltip>
  );
};
