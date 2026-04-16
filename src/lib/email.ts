import { Resend } from 'resend';

export async function sendJobAlertEmail(to: string, job: { company: string; role: string; area: string; salary: string }) {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        console.error('Resend API key is missing. Set RESEND_API_KEY in .env to enable email alerts.');
        return;
    }

    const resend = new Resend(apiKey);
    try {
        console.log(`Enviando alerta de vaga para ${to} (${job.area})`);

        await resend.emails.send({
            from: 'Alerta Vagas <onboarding@resend.dev>',
            to,
            subject: `Nova vaga em ${job.area}: ${job.role} na ${job.company}`,
            html: `
        <h1>Nova Vaga Disponível!</h1>
        <p>Olá,</p>
        <p>Uma nova vaga na sua área de atuação (${job.area}) foi publicada:</p>
        <ul>
          <li><strong>Empresa:</strong> ${job.company}</li>
          <li><strong>Cargo:</strong> ${job.role}</li>
          <li><strong>Salário:</strong> ${job.salary}</li>
        </ul>
        <p>Acesse o sistema para mais detalhes e candidatar-se.</p>
        <p>Atenciosamente,<br>Equipe Alerta Vagas</p>
      `,
        });
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        throw error;
    }
}