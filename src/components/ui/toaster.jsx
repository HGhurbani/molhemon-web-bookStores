import {
	Toast,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
} from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import React from 'react';

export function Toaster() {
        const { toasts } = useToast();

        return (
                <ToastProvider>
                        {toasts.map(({ id, title, description, action, ...props }) => {
                                const { dismiss, ...toastProps } = props;

                                return (
                                        <Toast
                                                key={id}
                                                {...toastProps}
                                                onOpenChange={(open) => {
                                                        if (!open) dismiss?.();
                                                }}
                                        >
                                                <div className="grid gap-1">
                                                        {title && <ToastTitle>{title}</ToastTitle>}
                                                        {description && (
                                                                <ToastDescription>{description}</ToastDescription>
                                                        )}
                                                </div>
                                                {action}
                                                <ToastClose />
                                        </Toast>
                                );
                        })}
                        <ToastViewport />
                </ToastProvider>
        );
}
