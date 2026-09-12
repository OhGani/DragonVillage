import './ui/styles.css';

const root = document.getElementById('app');
if (!root) throw new Error('#app 이 없어요');

const isTouch = window.matchMedia('(pointer: coarse)').matches;

function showError(title: string, detail: string): void {
  root!.innerHTML = '';
  const box = document.createElement('div');
  box.className = 'error-box';
  const h = document.createElement('h2');
  h.textContent = title;
  const pre = document.createElement('div');
  pre.textContent = detail;
  box.append(h, pre);
  root!.appendChild(box);
}

async function boot(): Promise<void> {
  const loading = document.createElement('div');
  loading.className = 'overlay show';
  loading.innerHTML = '<div class="overlay-card"><h1 class="overlay-title">불러오는 중…</h1></div>';
  root!.appendChild(loading);
  try {
    // 동적 import: data/*.json 검증 실패(DataError)도 여기서 잡는다
    const { createGame } = await import('./game/Game');
    const game = await createGame(root!, { isTouch });
    loading.remove();
    const startBtn = root!.querySelector<HTMLButtonElement>('.overlay-btn');
    const onStart = () => game.start();
    startBtn?.addEventListener('click', onStart, { once: true });
  } catch (err) {
    console.error(err);
    const e = err as { name?: string; message?: string };
    if (e?.name === 'DataError') showError('게임 데이터에 고칠 곳이 있어요', e.message ?? '');
    else showError('게임을 시작할 수 없어요', (e?.message ?? String(err)) + '\n\n브라우저가 WebGL2 를 지원하는지 확인해 주세요.');
  }
}

void boot();
