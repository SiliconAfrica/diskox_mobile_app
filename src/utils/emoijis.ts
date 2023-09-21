const smilies: string[] = [
    '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇',
  '😍', '🥰', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '😝', '🤑', '🤗', '🤩',
  '🤔', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪',
  '😫', '😴', '😌', '😛', '😜', '😝', '🤤', '😒', '😓', '😔', '😕', '🙁', '😖',
  '😞', '😟', '😠', '😡', '🤬', '😢', '😣', '😤', '😥', '😦', '😧', '😨', '😩',
  '🤯', '😬', '😰', '😱', '😳', '🤪', '😵', '😡', '😠', '🥴', '😲', '🥺', '😷',
  '🤒', '🤕', '🤢', '🤮', '🤧'
];

const hearts: string[] = [
    '💘', '💝', '💖', '💗', '💓', '💞', '💕', '❣️', '💔', '❤️', '🧡', '💛', '💚',
    '💙', '💜', '🤎', '🖤', '🤍'
];

const animals: string[] = [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🦝', '🐻', '🐼', '🦘', '🦡', '🐨', '🐯',
    '🦁', '🐮', '🐷', '🐽', '🐸', '🐒', '🦍', '🦧', '🐔', '🐧', '🐦', '🐤', '🦆',
    '🦢', '🦉', '🦚', '🦜', '🐺', '🐗', '🦌', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌',
    '🐞', '🐜', '🦗', '🕷️', '🦂', '🦟', '🦠', '🌵', '🍀', '🌿', '🍃', '🍂', '🍁',
    '🍄', '🌰', '🦀', '🦞', '🦐', '🦑', '🌍', '🌎', '🌏', '🌐', '🌋', '🏕️', '🏞️',
    '🏝️', '🏜️', '🏟️', '🏛️', '🏗️', '🧱', '🪨', '🪵', '🛖', '🏘️', '🏚️', '🏠',
    '🏡', '🏢', '🏣', '🏥', '🏦', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏯', '🏰',
    '💒', '🗼', '🗽', '⛪', '🕌', '🛕', '🕍', '⛩️', '🕋', '⛲', '⛺'
];

const food: string[] = [
    '🍔', '🍟', '🍕', '🌭', '🍿', '🧂', '🥓', '🍖', '🍗', '🥩', '🍠', '🥔', '🥯',
  '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🥞', '🧇', '🥓', '🥩', '🍔', '🍟', '🍕',
  '🌭', '🍿', '🧂', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫',
  '🍬', '🍭', '🍮', '🍯', '🍼', '🥛', '☕', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹',
  '🍺', '🍻', '🥂', '🥃', '🍶', '🍾', '🍹', '🍻', '🥂', '🥃', '🥄', '🍴', '🥢',
  '🍽️', '🥄', '🏺'
];

const travel: string[] = [
    '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋', '🚌',
  '🚍', '🚎', '🚐', '🚑', '🚒', '🚓', '🚔', '🚕', '🚖', '🚗', '🚘', '🚙', '🚚', '🚛', '🚜', '🏍️', '🛺', '🚲', '🛴', '🚏', '🚦',
  '🛣️', '🛤️', '🛢️', '⛽', '🚀', '🛸', '🛰️', '🚁', '🛶', '⛵', '🚤', '🛳️',
  '⛴️', '🚢', '✈️', '🛫', '🛬', '🪂', '💺', '🚁', '🚟', '🚠', '🚡', '🛤️',
  '🛢️', '🛣️', '🛴', '🚲', '🛵', '🛸', '🛹', '🛺', '🛻', '🛼', '🪀', '🪁',
  '🪂', '🏍️', '🛺', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝',
  '🚞', '🚋', '🚌', '🚍', '🚎', '🚐', '🚑', '🚒', '🚓', '🚔', '🚕', '🚖',
  '🚗', '🚘', '🚙', '🚚', '🚛', '🚜', '🏎️', '🏍️', '🛵', '🦼', '🦽', '🛺',
  '🚲', '🛴', '🚏', '🚦', '🛣️', '🛤️', '🛢️', '⛽', '🚉', '🚇', '🚆', '🚝',
  '🚄', '🚅', '🚈', '🚊', '🚋', '🚆', '🚅', '🚇', '🚉', '🛤️', '🛤️', '🚊',
  '🚍'
];

const activities: string[] = [
    '🎪', '🎭', '🎨', '🧵', '🎼', '🎤', '🎷', '🎸', '🎹', '🎺', '🎻', '🥁', '🎬',
    '🏹', '🛷', '🚴', '🚵', '🏇', '🏊', '🏄', '🤽', '🤾', '🤸', '🤺', '🥇', '🥈',
    '🥉', '🏆', '🏅', '🎖️', '🎗️', '🏵️', '🎫', '🎟️', '🎪', '🤹', '🎯', '🎳',
    '🎮', '🕹️', '🎰', '🎲', '🧩', '♟️', '🧗', '🧘', '🏋️', '🏌️', '🏂', '🤿',
    '🏋️', '🤼', '🤽', '🤾', '🤸', '🤺', '🤕', '🦓', '🦔', '🦕', '🦖', '🦥',
    '🦦', '🦩', '🦨', '🦮', '🐕', '🐩', '🐈', '🐓', '🦃', '🦚', '🦜', '🦢',
    '🦩', '🦨', '🦮', '🐕', '🐩', '🐈', '🐓', '🦃', '🦚', '🦜', '🦢', '🦉', '🦚',
    '🦜', '🦢', '🦉', '🦢', '🦚', '🦜', '🦢', '🦉', '🦚', '🦜', '🦢', '🦉', '🦢',
    '🦚', '🦜', '🦢', '🦉', '🦚', '🦜', '🦢', '🦉', '🦢', '🦚', '🦜', '🦢', '🦉',
    '🦚', '🦜', '🦢', '🦉', '🦢', '🦚', '🦜', '🦢', '🦉', '🦚', '🦜', '🦢', '🦉',
    '🦢', '🦚', '🦜', '🦢', '🦉', '🦢', '🦚', '🦜', '🦢', '🦉', '🦚', '🦜', '🦢',
    '🦉'
];

const objects: string[] = [
    '🌂', '☂️', '🎃', '🎄', '🎈', '🎉', '🎊', '🎋', '🎍', '🎎', '🎏', '🎐', '🎑',
  '🧨', '🎀', '🎁', '🏮', '📯', '🎙️', '🎚️', '🎛️', '🎤', '🎧', '📻', '🎷',
  '🎸', '🎹', '🎺', '🎻', '🥁', '🪘', '📱', '📲', '☎️', '📞', '📟', '📠', '🔋',
  '🔌', '💻', '🖥️', '🖨️', '⌨️', '🖱️', '🖲️', '💽', '💾', '💿', '📀', '🧮', '🎥',
  '🎞️', '📽️', '📺', '📷', '📸', '📹', '📼', '🔍', '🔎', '🕯️', '💡', '🔦', '🏮',
  '🪔', '🕰️', '🛢️', '💳', '💴', '💵', '💶', '💷', '💸', '💹', '💱', '💲', '🧾',
  '💰', '💼', '👜', '👝', '🛍️', '🎒', '👞', '👟', '🥾', '🥿', '👠', '👡', '👢',
  '👑', '👒', '🎩', '🎓', '🧢', '⛑️', '📿', '💎', '🔧', '🔨', '🛠️', '⚙️', '🧰', '🔩', '⚗️', '🧪', '🧫', '🧬',
  '🔬', '🔭', '📡', '🕳️', '🚪', '🛏️', '🛋️', '🚽', '🚿', '🛁', '🪒', '🧴', '🧷',
  '🧹', '🧺', '🧻', '🪣', '🧼', '🪥', '🧽', '🧯', '🛒', '🚬', '⚰️', '🪦', '📧',
  '📨', '📩', '📤', '📥', '📦', '📫', '📪', '📬', '📭', '📮', '🗳️', '✉️', '📧',
  '📨', '📩', '📤', '📥', '📦', '📫', '📪', '📬', '📭', '📮', '🗳️', '✉️', '📯',
  '📜', '📃', '📄', '📑', '🧾', '📊', '📈', '📉', '🗒️', '🗓️', '📆', '📅', '📇',
  '🗃️', '🗳️', '🗄️', '📋', '🗒️', '🗓️', '📆', '📅', '📇', '🗃️', '🗳️', '🗄️',
  '📋', '📁', '📂', '🗂️', '📰', '🗞️', '📓', '📔', '📒', '📕', '📗', '📘', '📙',
  '📚', '📖', '🔖', '🧷', '📛', '📐', '📏', '📌', '📍', '🚩', '🏳️', '🏴', '🏁',
  '🚀', '🛸', '🛰️', '🚁', '🛶', '⛵', '🚤', '🛳️', '⛴️', '🚢', '✈️', '🛫', '🛬',
  '🪂', '💺', '🚁', '🚟', '🚠', '🚡', '🛤️', '🛢️', '🛣️', '🛴', '🚲', '🛵', '🛸',
  '🛹', '🛺', '🛻', '🛼', '🪀', '🪁', '🪂', '🏍️', '🛺', '🚃', '🚄', '🚅', '🚆',
  '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋', '🚌', '🚍', '🚎', '🚐', '🚑', '🚒',
  '🚓', '🚔', '🚕', '🚖', '🚗', '🚘', '🚙', '🚚', '🚛', '🚜', '🏎️', '🏍️', '🛵',
  '🦼', '🦽', '🛺', '🚲', '🛴', '🚏', '🚦', '🛣️', '🛤️', '🛢️', '⛽', '🚉', '🚇',
  '🚆', '🚝', '🚄', '🚅', '🚈', '🚊', '🚋', '🚆', '🚅', '🚇', '🚉', '🛤️', '🛤️',
  '🚊', '🚍', '🚎'
];

const nature: string[] = [
    '☀️', '🌤️', '⛅', '🌥️', '☁️', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️', '❄️', '☃️',
    '⛄', '🌬️', '💨', '🌪️', '🌫️', '🌊', '💧', '💦', '🌧️', '⛈️', '🌩️', '🌨️',
    '❄️', '☃️', '⛄', '🌬️', '💨', '🌪️', '🌫️', '🌊', '💧', '💦', '🌫️', '🌊',
    '🌩️', '⚡', '🌪️', '❄️', '☔', '💨', '🌫️', '🌊', '💧', '💦', '🌧️', '⛈️',
    '🌨️', '❄️', '☃️', '⛄', '🌬️', '🌪️', '🌫️', '🌊', '💧', '💦', '🌧️', '⛈️',
    '🌨️', '❄️', '☃️', '⛄', '🌬️', '🌪️', '🌫️', '🌊', '💧', '💦', '🌊', '🌪️',
    '🌫️', '🌪️', '🌫️', '🌊', '💧', '💦', '🌊', '🌪️', '🌫️', '🌪️', '🌫️', '🌊',
    '💧', '💦', '🌪️', '🌫️', '🌊', '🌫️', '🌊', '💧', '💦', '🌊', '🌫️', '🌊',
    '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧',
    '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦',
    '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊',
    '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧',
    '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦',
    '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊',
    '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧',
    '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦',
    '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊',
    '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧',
    '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦',
    '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊',
    '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧',
    '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦',
    '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊',
    '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧',
    '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦',
    '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '🌪️', '❄️', '☔', '💨', '🌫️', '🌊', '💧', '💦', '🌪️', '🌫️', '🌊',
    '💧', '💦', '🌪️', '🌫️', '🌊', '🌪️', '🌫️', '🌊', '💧', '💦', '🌪️', '🌫️', '🌊',
    '💧', '💦', '🌪️', '🌫️', '🌊', '🌫️', '🌊', '💧', '💦', '🌊', '🌫️', '🌊', '💧',
    '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦',
    '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊',
    '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧',
    '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦',
    '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊',
    '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧',
    '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦',
    '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊',
    '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧',
    '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦',
    '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊',
    '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧',
    '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦',
    '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊',
    '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧',
    '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦',
    '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊',
    '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧',
    '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦',
    '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊',
    '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧',
    '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦',
    '🌊', '💧', '💦', '🌊', '💧', '💦', '🌊', '💧', '💦',
];

const symbols: string[] = [
    '💯', '🔢', '🔣', '🔠', '🔡', '🔤', '🅰️', '🆎', '🅱️', '🆑', '🆒', '🆓', 'ℹ️',
  '🆔', 'Ⓜ️', '🆕', '🆖', '🆗', '🆘', '🆙', '🆚', '🈁', '🈂️', '🈷️', '🈶', '🈯',
  '🉐', '🈹', '🈚', '🈲', '🉑', '🈸', '🈴', '🈳', '㊗️', '㊙️', '🈺', '🈵', '🔴',
  '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫', '⚪', '🟥', '🟧', '🟨', '🟩', '🟦',
  '🟪', '🟫', '⬛', '⬜', '◼️', '◻️', '◾', '◽', '▪️', '▫️', '🔶', '🔷', '🔸',
  '🔹', '🔺', '🔻', '💠', '🔘', '🔳', '🔲', '🏁', '🚩', '🎌', '🏴', '🏳️', '🇦🇨',
  '🇦🇩', '🇦🇪', '🇦🇫', '🇦🇬', '🇦🇮', '🇦🇱', '🇦🇲', '🇦🇴', '🇦🇶', '🇦🇷', '🇦🇸', '🇦🇹',
  '🇦🇺', '🇦🇼', '🇦🇽', '🇦🇿', '🇧🇦', '🇧🇧', '🇧🇩', '🇧🇪', '🇧🇫', '🇧🇬', '🇧🇭', '🇧🇮',
  '🇧🇯', '🇧🇱', '🇧🇲', '🇧🇳', '🇧🇴', '🇧🇶', '🇧🇷', '🇧🇸', '🇧🇹', '🇧🇻', '🇧🇼', '🇧🇾',
  '🇧🇿', '🇨🇦', '🇨🇨', '🇨🇩', '🇨🇫', '🇨🇬', '🇨🇭', '🇨🇮', '🇨🇰', '🇨🇱', '🇨🇲', '🇨🇳',
  '🇨🇴', '🇨🇵', '🇨🇷', '🇨🇺', '🇨🇻', '🇨🇼', '🇨🇽', '🇨🇾', '🇨🇿', '🇩🇪', '🇩🇬', '🇩🇯',
  '🇩🇰', '🇩🇲', '🇩🇴', '🇩🇿', '🇪🇦', '🇪🇨', '🇪🇪', '🇪🇬', '🇪🇭', '🇪🇷', '🇪🇸', '🇪🇹',
  '🇪🇺', '🇫🇮', '🇫🇯', '🇫🇰', '🇫🇲', '🇫🇴', '🇫🇷', '🇬🇦', '🇬🇧', '🇬🇩', '🇬🇪', '🇬🇫',
  '🇬🇬', '🇬🇭', '🇬🇮', '🇬🇱', '🇬🇲', '🇬🇳', '🇬🇵', '🇬🇶', '🇬🇷', '🇬🇸', '🇬🇹', '🇬🇺', '🇬🇼',
  '🇬🇾', '🇭🇰', '🇭🇲', '🇭🇳', '🇭🇷', '🇭🇹', '🇭🇺', '🇮🇨', '🇮🇩', '🇮🇪', '🇮🇱', '🇮🇲', '🇮🇳',
  '🇮🇴', '🇮🇶', '🇮🇷', '🇮🇸', '🇮🇹', '🇯🇪', '🇯🇲', '🇯🇴', '🇯🇵', '🇰🇪', '🇰🇬', '🇰🇭', '🇰🇮',
  '🇰🇲', '🇰🇳', '🇰🇵', '🇰🇷', '🇰🇼', '🇰🇾', '🇰🇿', '🇱🇦', '🇱🇧', '🇱🇨', '🇱🇮', '🇱🇰', '🇱🇷',
  '🇱🇸', '🇱🇷', '🇱🇸', '🇱🇹', '🇱🇺', '🇱🇻', '🇱🇾', '🇲🇦', '🇲🇨', '🇲🇩', '🇲🇪', '🇲🇫', '🇲🇬',
  '🇲🇭', '🇲🇰', '🇲🇱', '🇲🇲', '🇲🇳', '🇲🇴', '🇲🇵', '🇲🇶', '🇲🇷', '🇲🇸', '🇲🇹', '🇲🇺', '🇲🇻',
  '🇲🇼', '🇲🇽', '🇲🇾', '🇲🇿', '🇳🇦', '🇳🇨', '🇳🇪', '🇳🇫', '🇳🇬', '🇳🇮', '🇳🇱', '🇳🇴', '🇳🇵',
  '🇳🇷', '🇳🇺', '🇳🇿', '🇴🇲', '🇵🇦', '🇵🇪', '🇵🇫', '🇵🇬', '🇵🇭', '🇵🇰', '🇵🇱', '🇵🇲', '🇵🇳',
  '🇵🇷', '🇵🇸', '🇵🇹', '🇵🇼', '🇵🇾', '🇶🇦', '🇷🇪', '🇷🇴', '🇷🇸', '🇷🇺', '🇷🇼', '🇸🇦', '🇸🇧',
  '🇸🇨', '🇸🇩', '🇸🇪', '🇸🇬', '🇸🇭', '🇸🇮', '🇸🇯', '🇸🇰', '🇸🇱', '🇸🇲', '🇸🇳', '🇸🇴', '🇸🇷',
  '🇸🇸', '🇸🇹', '🇸🇻', '🇸🇽', '🇸🇾', '🇸🇿', '🇹🇦', '🇹🇨', '🇹🇩', '🇹🇫', '🇹🇬', '🇹🇭', '🇹🇯',
  '🇹🇰', '🇹🇱', '🇹🇲', '🇹🇳', '🇹🇴', '🇹🇷', '🇹🇹', '🇹🇻', '🇹🇼', '🇹🇿', '🇺🇦', '🇺🇬', '🇺🇲',
  '🇺🇳', '🇺🇸', '🇺🇾', '🇺🇿', '🇻🇦', '🇻🇨', '🇻🇪', '🇻🇬', '🇻🇮', '🇻🇳', '🇻🇺', '🇼🇫', '🇼🇸',
  '🇽🇰', '🇾🇪', '🇾🇹', '🇿🇦', '🇿🇲', '🇿🇼', '🏴‍☠️', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', '🏴󠁧󠁢󠁷󠁬󠁳󠁿', '🇦🇮', '🇦🇶', '🇧🇻',
  '🇨🇽', '🇨🇨', '🇨🇰', '🇨🇼', '🇨🇾', '🇨🇲', '🇪🇦', '🇬🇬', '🇬🇱', '🇬🇶', '🇬🇩', '🇯🇪', '🇲🇴',
  '🇲🇵', '🇲🇶', '🇲🇸', '🇳🇫', '🇳🇴', '🇵🇲', '🇵🇳', '🇷🇪', '🇸🇭', '🇸🇽', '🇹🇦', '🇹🇴', '🇻🇨',
  '🇪🇺',
];

export { hearts, smilies,activities, animals, travel, objects, symbols, food, nature };