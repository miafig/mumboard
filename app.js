function normalizeLabel(value) {
  return (value || '')
    .trim()
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    || 'untitled';
}

async function init(){
  const board = document.getElementById('board');
  let activeButton = null;

  const setActiveButton = (btn) => {
    if (activeButton && activeButton !== btn) {
      activeButton.classList.remove('is-playing');
    }
    activeButton = btn;
    if (btn) btn.classList.add('is-playing');
  };

  const buildEmptyTile = () => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tile is-empty';
    btn.disabled = true;
    btn.textContent = '';
    return btn;
  };

  const buildSoundTile = (path) => {
    const name = path.split('/').pop();
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tile';
    btn.textContent = normalizeLabel(name);

    const audio = new Audio(path);
    audio.preload = 'auto';

    const stopActiveState = () => {
      if (activeButton === btn) {
        btn.classList.remove('is-playing');
        activeButton = null;
      }
    };

    audio.addEventListener('play', () => setActiveButton(btn));
    audio.addEventListener('ended', stopActiveState);
    audio.addEventListener('pause', () => {
      if (audio.currentTime >= audio.duration && audio.duration > 0) {
        stopActiveState();
      }
    });

    btn.addEventListener('click', () => {
      try {
        if (activeButton && activeButton !== btn) {
          const current = activeButton;
          current.pause();
          current.currentTime = 0;
          current.classList.remove('is-playing');
        }

        if (audio.paused) {
          audio.currentTime = 0;
          audio.play();
        } else {
          audio.pause();
          audio.currentTime = 0;
          stopActiveState();
        }
      } catch (e) {
        console.warn(e);
      }
    });

    return btn;
  };

  try {
    const res = await fetch('sounds/sounds.json');
    if (!res.ok) throw new Error('manifest not found');
    const files = await res.json();

    const totalSlots = Math.max(36, files.length);
    const columns = Math.max(6, Math.ceil(Math.sqrt(totalSlots)));
    board.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;

    files.forEach((path) => {
      board.appendChild(buildSoundTile(path));
    });

    while (board.children.length < totalSlots) {
      board.appendChild(buildEmptyTile());
    }
  } catch (err) {
    board.innerHTML = '<p class="note">No sounds manifest found. Run <code>generate_manifest.py</code> to create <code>sounds/sounds.json</code>.</p>';
    console.warn(err);
  }
}

document.addEventListener('DOMContentLoaded', init);
