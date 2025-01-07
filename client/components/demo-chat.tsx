'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FullDemo } from './full-demo';
import { FadeTransition } from './fade-transition';

export function DemoChat() {
  const [inputMessage, setInputMessage] = useState('');
  const [showFullDemo, setShowFullDemo] = useState(false);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setShowFullDemo(true);
    }
  };

  return (
    <>
      <FadeTransition show={!showFullDemo}>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Try ChatGenius</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Type a message and hit send to experience our demo chat with AI!
            </p>
          </CardContent>
          <CardFooter>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex w-full space-x-2"
            >
              <Input
                type="text"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <Button type="submit">Send</Button>
            </form>
          </CardFooter>
        </Card>
      </FadeTransition>
      <FadeTransition show={showFullDemo}>
        {showFullDemo && <FullDemo initialMessage={inputMessage} />}
      </FadeTransition>
    </>
  );
}
