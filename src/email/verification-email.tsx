import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Section,
} from '@react-email/components';

interface Props {
  name: string;
  otp: string;
  otpExpiresAt: Date;
}

const styles = {
  body: {
    backgroundColor: '#f3f4f6',
    padding: '40px 0',
    fontFamily: 'Inter, sans-serif',
  },
  container: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '0.5rem',
    maxWidth: '480px',
    margin: '0 auto',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '20px',
  },
  text: {
    fontSize: '16px',
    color: '#4b5563',
    lineHeight: '1.5',
    marginBottom: '20px',
  },
  codeContainer: {
    backgroundColor: '#f9fafb',
    padding: '16px',
    textAlign: 'center' as const,
    borderRadius: '8px',
    fontSize: '24px',
    fontWeight: 'bold' as const,
    letterSpacing: '4px',
    color: '#111827',
    marginBottom: '20px',
    border: '1px solid #e5e7eb',
  },
  footer: {
    fontSize: '14px',
    color: '#9ca3af',
    marginTop: '32px',
  },
};

export default function VerificationEmail({ name, otp, otpExpiresAt }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Your OTP code is {otp}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>Hello {name},</Heading>

          <Text style={styles.text}>
            Use the code below to verify your email address. This code is valid
            for a short time.
          </Text>

          <Section style={styles.codeContainer}>{otp}</Section>

          <Text style={styles.text}>
            This code will expire on {otpExpiresAt.toLocaleString()}
          </Text>

          <Text style={styles.text}>
            If you didn’t request this, you can safely ignore this email.
          </Text>

          <Text style={styles.footer}>
            Thanks,
            <br />
            The Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
