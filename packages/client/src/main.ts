import './ui/styles.css';
import { showLobby } from './ui/lobby';
import { askPin } from './ui/pinDialog';

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
  const lobby = showLobby(root!);

  // GitHub Pages(HTTPS) 에서는 http:// 게임 서버로 WebSocket 을 열 수 없다 → 서버 주소로 안내만
  const serverEnv = (import.meta.env.VITE_SERVER_URL as string | undefined)?.trim();
  if (location.protocol === 'https:' && serverEnv && serverEnv.startsWith('http:')) {
    lobby.blockWith(`이 페이지에서는 게임 서버에 연결할 수 없어요.<br>여기로 들어가 주세요: <a href="${serverEnv}${location.search}">${serverEnv}</a>`);
    return;
  }

  const { NetClient } = await import('./net/NetClient');
  for (;;) {
    const choice = await lobby.waitChoice();
    const net = new NetClient();
    try {
      lobby.setStatus('서버에 연결하는 중…');
      await net.connect();
      lobby.setStatus('마을에 들어가는 중…');
      const enter = () => (choice.code ? net.join(choice.nick, choice.color, choice.code) : net.create(choice.nick, choice.color, `${choice.nick}의 마을`));
      let welcome;
      try {
        welcome = await enter();
      } catch (err) {
        // 이 이름은 다른 기기의 것 → PIN 으로 이어하기 (#63)
        const e = err as { name?: string; code?: string };
        if (e?.name !== 'NetError' || e.code !== 'NICK_TAKEN') throw err;
        lobby.setStatus('');
        const pin = await askPin(root!, `"${choice.nick}" 은 이미 있는 이름이에요`, '네 이름이면 PIN 4자리를 넣어 이어해요.\n아니면 다른 이름으로 들어가요.', '이어하기');
        if (!pin) {
          lobby.setError('다른 이름을 적어 주세요');
          net.close();
          continue;
        }
        lobby.setStatus('이어하는 중…');
        await net.resume(choice.nick, pin);
        welcome = await enter();
      }
      if (welcome.needPin) {
        // 처음 쓰는 이름: PIN 을 정해 두면 다른 폰에서도 이 계정으로 들어올 수 있다
        const pin = await askPin(root!, 'PIN 정하기', `"${choice.nick}" 은 이제 네 이름이에요.\n다른 폰에서도 쓰려면 숫자 4자리 PIN 을 정해요. 잊지 마세요!`, '정하기', null);
        if (pin) await net.setPin(pin);
      }
      lobby.setStatus(`세계를 만드는 중… (마을 코드 ${welcome.village.code})`);
      try {
        localStorage.setItem('dv.code', welcome.village.code);
      } catch {
        /* 무시 */
      }
      // 동적 import: data/*.json 검증 실패(DataError)도 여기서 잡는다
      const { createGame } = await import('./game/Game');
      const game = await createGame(root!, { isTouch, net, welcome });
      lobby.close();
      const startBtn = root!.querySelector<HTMLButtonElement>('.overlay .overlay-btn');
      startBtn?.addEventListener('click', () => game.start(), { once: true });
      return;
    } catch (err) {
      console.error(err);
      net.close();
      const e = err as { name?: string; message?: string; code?: string };
      if (e?.name === 'DataError') {
        lobby.close();
        showError('게임 데이터에 고칠 곳이 있어요', e.message ?? '');
        return;
      }
      if (e?.name === 'NetError') {
        lobby.setError(e.message ?? '연결에 실패했어요');
        continue;
      }
      lobby.close();
      showError('게임을 시작할 수 없어요', (e?.message ?? String(err)) + '\n\n브라우저가 WebGL2 를 지원하는지 확인해 주세요.');
      return;
    }
  }
}

void boot();
