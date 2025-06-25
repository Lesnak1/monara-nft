import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'MONARA - Evolving Digital Beings';
    
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0F0F23',
            backgroundImage: 'linear-gradient(135deg, #200052 0%, #836EF9 50%, #A0055D 100%)',
          }}
        >
          {/* Neural Network Background */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `
                radial-gradient(circle at 25% 25%, rgba(131, 110, 249, 0.2) 0%, transparent 40%),
                radial-gradient(circle at 75% 75%, rgba(160, 5, 93, 0.2) 0%, transparent 40%),
                radial-gradient(circle at 50% 50%, rgba(32, 0, 82, 0.3) 0%, transparent 60%)
              `,
            }}
          />
          
          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '40px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Logo/Symbol */}
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #836EF9 0%, #A0055D 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '32px',
                boxShadow: '0 20px 60px rgba(131, 110, 249, 0.4)',
              }}
            >
              <span
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                M
              </span>
            </div>
            
            {/* Title */}
            <h1
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '16px',
                background: 'linear-gradient(135deg, #836EF9 0%, #A0055D 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {title}
            </h1>
            
            {/* Subtitle */}
            <p
              style={{
                fontSize: '32px',
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '24px',
                maxWidth: '800px',
                lineHeight: 1.3,
              }}
            >
              Evolving Digital Beings on Monad Network
            </p>
            
            {/* Network Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 24px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  marginRight: '12px',
                }}
              />
              <span
                style={{
                  fontSize: '20px',
                  color: 'white',
                  fontWeight: '600',
                }}
              >
                Powered by Monad
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error: unknown) {
    console.error('OG Image generation failed:', error);
    return new Response('Failed to generate OG image', { status: 500 });
  }
} 