import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-pages'
import { cors } from 'hono/cors'

type Bindings = {
    DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS for API routes
app.use('/api/*', cors())

// API: Get leaderboard scores
app.get('/api/leaderboard', async (c) => {
    const mode = c.req.query('mode') || 'marathon';
    const limit = Math.min(parseInt(c.req.query('limit') || '50'), 100);

    try {
        // Check if DB binding exists
        if (!c.env?.DB) {
            // Return mock data for local development
            const mockData: Record<string, Array<{username: string, score: number, mode: string, level: number, lines: number}>> = {
                marathon: [
                    { username: 'JasonDevine', score: 150000, mode: 'marathon', level: 15, lines: 120 },
                    { username: 'TetrisMaster', score: 125000, mode: 'marathon', level: 12, lines: 100 },
                    { username: 'BlockBuilder', score: 100000, mode: 'marathon', level: 10, lines: 80 },
                    { username: 'PuzzlePro', score: 75000, mode: 'marathon', level: 8, lines: 60 },
                    { username: 'LineClears', score: 50000, mode: 'marathon', level: 6, lines: 40 }
                ],
                sprint: [
                    { username: 'SpeedRunner', score: 65, mode: 'sprint', level: 5, lines: 40 },
                    { username: 'FastHands', score: 72, mode: 'sprint', level: 4, lines: 40 },
                    { username: 'QuickDrop', score: 85, mode: 'sprint', level: 4, lines: 40 }
                ],
                ultra: [
                    { username: 'ScoreMaster', score: 95000, mode: 'ultra', level: 10, lines: 85 },
                    { username: 'TimeTrial', score: 82000, mode: 'ultra', level: 9, lines: 72 },
                    { username: 'TwoMinKing', score: 70000, mode: 'ultra', level: 8, lines: 65 }
                ]
            };
            return c.json({ 
                scores: mockData[mode] || [],
                mode 
            });
        }

        const results = await c.env.DB.prepare(
            `SELECT username, score, mode, level, lines, created_at 
             FROM leaderboard 
             WHERE mode = ? 
             ORDER BY score DESC 
             LIMIT ?`
        ).bind(mode, limit).all();

        return c.json({ scores: results.results || [], mode });
    } catch (error) {
        console.error('Leaderboard fetch error:', error);
        return c.json({ scores: [], mode, error: 'Failed to fetch leaderboard' }, 500);
    }
});

// API: Submit score to leaderboard
app.post('/api/leaderboard', async (c) => {
    try {
        const body = await c.req.json();
        const { username, score, mode, level, lines } = body;

        // Validation
        if (!username || typeof username !== 'string' || username.trim().length === 0) {
            return c.json({ success: false, error: 'Username is required' }, 400);
        }

        if (!score || typeof score !== 'number' || score < 0) {
            return c.json({ success: false, error: 'Valid score is required' }, 400);
        }

        const validModes = ['marathon', 'sprint', 'ultra', 'zen'];
        if (!validModes.includes(mode)) {
            return c.json({ success: false, error: 'Invalid game mode' }, 400);
        }

        // Sanitize username (max 20 chars, alphanumeric and underscore only)
        const sanitizedUsername = username.trim().substring(0, 20).replace(/[^a-zA-Z0-9_]/g, '');

        if (sanitizedUsername.length === 0) {
            return c.json({ success: false, error: 'Username must contain valid characters' }, 400);
        }

        // Check if DB binding exists
        if (!c.env?.DB) {
            // In development mode, just return success
            return c.json({ 
                success: true, 
                message: 'Score recorded (development mode)',
                data: { username: sanitizedUsername, score, mode, level, lines }
            });
        }

        // Insert score into database
        const result = await c.env.DB.prepare(
            `INSERT INTO leaderboard (username, score, mode, level, lines) 
             VALUES (?, ?, ?, ?, ?)`
        ).bind(sanitizedUsername, score, mode, level || 1, lines || 0).run();

        // Get the user's rank for this mode
        const rankResult = await c.env.DB.prepare(
            `SELECT COUNT(*) as rank 
             FROM leaderboard 
             WHERE mode = ? AND score > ?`
        ).bind(mode, score).first();

        const rank = (rankResult?.rank as number || 0) + 1;

        return c.json({ 
            success: true, 
            message: 'Score submitted successfully',
            data: {
                username: sanitizedUsername,
                score,
                mode,
                level,
                lines,
                rank
            }
        });
    } catch (error) {
        console.error('Score submission error:', error);
        return c.json({ success: false, error: 'Failed to submit score' }, 500);
    }
});

// API: Get user's personal best scores
app.get('/api/leaderboard/user/:username', async (c) => {
    const username = c.req.param('username');

    try {
        if (!c.env?.DB) {
            return c.json({ scores: [], username });
        }

        const results = await c.env.DB.prepare(
            `SELECT mode, MAX(score) as best_score, MAX(level) as max_level, MAX(lines) as max_lines
             FROM leaderboard 
             WHERE username = ?
             GROUP BY mode
             ORDER BY best_score DESC`
        ).bind(username).all();

        return c.json({ scores: results.results || [], username });
    } catch (error) {
        console.error('User scores fetch error:', error);
        return c.json({ scores: [], username, error: 'Failed to fetch scores' }, 500);
    }
});

// Health check endpoint
app.get('/api/health', (c) => {
    return c.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        version: '2.0'
    });
});

// Serve static files
app.use('/icons/*', serveStatic())
app.use('/css/*', serveStatic())
app.use('/js/*', serveStatic())
app.use('/audio/*', serveStatic())
app.use('/manifest.json', serveStatic())
app.use('/sw.js', serveStatic())

// Serve index.html at root
app.get('/', serveStatic({ path: './index.html' }))

// Fallback to index.html for SPA routing
app.get('*', serveStatic({ path: './index.html' }))

export default app
