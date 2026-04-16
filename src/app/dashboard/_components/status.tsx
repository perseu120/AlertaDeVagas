import {
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    UserIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function ApplicationStatus({ status }: { status: string }) {
    return (
        <span
            className={clsx(
                'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
                {
                    'bg-yellow-100 text-yellow-700': status === 'screening',
                    'bg-blue-100 text-blue-700': status === 'interview',
                    'bg-green-100 text-green-700': status === 'approved',
                    'bg-red-100 text-red-700': status === 'rejected',
                },
            )}
        >
            {status === 'screening' && (
                <>
                    Triagem
                    <UserIcon className="w-4" />
                </>
            )}

            {status === 'interview' && (
                <>
                    Entrevista
                    <ClockIcon className="w-4" />
                </>
            )}

            {status === 'approved' && (
                <>
                    Aprovado
                    <CheckCircleIcon className="w-4" />
                </>
            )}

            {status === 'rejected' && (
                <>
                    Rejeitado
                    <XCircleIcon className="w-4" />
                </>
            )}
        </span>
    );
}