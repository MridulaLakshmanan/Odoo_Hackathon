import * as Dialog from '@radix-ui/react-dialog';
import { AlertTriangle, X } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
}

export function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel = 'Delete', onConfirm }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#FEF2F2' }}>
              <AlertTriangle size={20} style={{ color: '#F2726F' }} />
            </div>
            <div className="flex-1">
              <Dialog.Title className="font-semibold text-gray-900 mb-1">{title}</Dialog.Title>
              <Dialog.Description className="text-sm text-gray-500 leading-relaxed">{description}</Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-gray-600 transition-colors mt-0.5">
                <X size={16} />
              </button>
            </Dialog.Close>
          </div>
          <div className="flex gap-3 mt-6 justify-end">
            <Dialog.Close asChild>
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all">
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={() => { onConfirm(); onOpenChange(false); }}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all"
              style={{ backgroundColor: '#F2726F' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#E05A58')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#F2726F')}
            >
              {confirmLabel}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
