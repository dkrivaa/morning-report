'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/');
      router.refresh();
    } else {
      setError('סיסמה שגויה');
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex mt-18 justify-center">
      <form onSubmit={handleSubmit} >
        <Field className="flex flex-col gap-8 border-2 rounded-2xl p-4">
            <FieldLabel htmlFor="password" className='text-lg font-semibold'>
                Login
            </FieldLabel>
            <div className='flex flex-col gap-4'>
                <Input
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter Password'
                required
                autoFocus
                />
                <FieldDescription>
                    Enter App password to proceed
                </FieldDescription>
            </div>
            
            <Button type="submit">
                Submit
            </Button>


        </Field>
      </form>
    </main>
  );
}