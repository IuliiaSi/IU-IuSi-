const http = require('http');
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const { createClient } = require('@supabase/supabase-js');

const PORT = 5000;
const HOST = '0.0.0.0';
const ROOT = path.join(__dirname, 'Lectures&HW', 'projects');

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  'https://tvgepqtemmqcactioskm.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  process.env.AI_INTEGRATIONS_SUPABASE_ANON_KEY;

const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch (e) { reject(e); }
    });
  });
}

async function handleAnalyze(req, res) {
  try {
    const data = await parseBody(req);
    const { name, brand, model, year, mileage, serviceList } = data;

    const prompt = `Ты — независимый автомобильный эксперт. Пользователь обратился за вторым мнением о рекомендациях автосервиса.

Данные автомобиля:
- Марка и модель: ${brand} ${model}
- Год выпуска: ${year}
- Пробег: ${mileage} км

Рекомендации сервиса:
${serviceList || 'Не указаны'}

Проанализируй каждую рекомендацию и раздели их на три группы:
1. ✅ Сделать сейчас — критически важно, нельзя откладывать
2. ⏳ Можно отложить — желательно, но не срочно
3. ❌ Не требуется — лишняя работа или слишком рано по пробегу/регламенту

Дай краткое объяснение по каждому пункту. Ответ пиши на русском языке, структурированно и понятно для обычного владельца авто.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-5-nano',
      messages: [{ role: 'user', content: prompt }],
    });

    const answer = completion.choices[0]?.message?.content || 'Не удалось получить ответ.';

    if (supabase) {
      const userInput = JSON.stringify({
        name,
        brand,
        model,
        year,
        mileage,
        serviceList,
      });

      const { error: saveError } = await supabase
        .from('entries')
        .insert([{ user_input: userInput, ai_response: answer }]);

      if (saveError) {
        console.error('Supabase insert error:', saveError);
      }
    } else {
      console.warn('Supabase is not configured. Set SUPABASE_ANON_KEY to save entries.');
    }

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ result: answer }));
  } catch (err) {
    console.error('AI error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Ошибка при обращении к AI. Попробуйте ещё раз.' }));
  }
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/analyze') {
    return handleAnalyze(req, res);
  }

  let urlPath = req.url === '/' ? '/index.html' : req.url;
  const filePath = path.join(ROOT, urlPath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
});
