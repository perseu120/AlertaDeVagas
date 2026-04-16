import {
    CheckCircleIcon,
    ClockIcon,
    PauseCircleIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function InvoiceStatus({ status }: { status: string }) {
    return (
        <span
            className={clsx(
                'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
                {
                    'bg-green-100 text-green-700': status === 'open',
                    'bg-yellow-100 text-yellow-700': status === 'paused',
                    'bg-blue-100 text-blue-700': status === 'filled',
                    'bg-gray-200 text-gray-700': status === 'closed',
                },
            )}
        >
            {status === 'open' && (
                <>
                    Aberta
                    <ClockIcon className="w-4" />
                </>
            )}

            {status === 'paused' && (
                <>
                    Pausada
                    <PauseCircleIcon className="w-4" />
                </>
            )}

            {status === 'filled' && (
                <>
                    Preenchida
                    <CheckCircleIcon className="w-4" />
                </>
            )}

            {status === 'closed' && (
                <>
                    Encerrada
                    <XCircleIcon className="w-4" />
                </>
            )}
        </span>
    );
}