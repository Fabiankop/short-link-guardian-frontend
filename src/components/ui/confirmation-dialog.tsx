import React from "react";
import { AlertCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "warning" | "info";
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
  variant = "danger",
}) => {
  // Definir variantes de estilos según el tipo de diálogo
  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          header: "bg-gradient-to-r from-red-500 to-red-700",
          icon: "text-red-500",
          iconBg: "bg-red-100",
          confirmButton: "bg-red-500 hover:bg-red-600 text-white",
        };
      case "warning":
        return {
          header: "bg-gradient-to-r from-amber-500 to-amber-700",
          icon: "text-amber-500",
          iconBg: "bg-amber-100",
          confirmButton: "bg-amber-500 hover:bg-amber-600 text-white",
        };
      case "info":
        return {
          header: "bg-gradient-to-r from-primary to-primary-hover",
          icon: "text-primary",
          iconBg: "bg-primary/10",
          confirmButton: "bg-primary hover:bg-primary-hover text-white",
        };
      default:
        return {
          header: "bg-gradient-to-r from-red-500 to-red-700",
          icon: "text-red-500",
          iconBg: "bg-red-100",
          confirmButton: "bg-red-500 hover:bg-red-600 text-white",
        };
    }
  };

  const styles = getVariantStyles();

  // Variantes para animaciones
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -20,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
            onClick={onCancel}
          />

          {/* Dialog */}
          <motion.div
            className="z-10 w-full max-w-md"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dialogVariants}
          >
            <Card className="shadow-xl overflow-hidden border-0">
              <CardHeader className={`${styles.header} text-white`}>
                <CardTitle className="text-xl font-semibold">{title}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`${styles.iconBg} p-3 rounded-full`}>
                    <AlertCircle className={`h-6 w-6 ${styles.icon}`} />
                  </div>
                  <p className="text-gray-700">{message}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-3 p-4 bg-gray-50">
                <Button
                  variant="outline"
                  onClick={onCancel}
                  className="hover:bg-gray-100"
                >
                  {cancelLabel}
                </Button>
                <Button
                  onClick={onConfirm}
                  className={`${styles.confirmButton}`}
                >
                  {confirmLabel}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export { ConfirmationDialog };
