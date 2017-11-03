{
  const channels = ['OgamingSC2', 'freecodecamp', 'storbeck', 'terakilobyte', 'habathcx', 'RobotCaleb', 'thomasballinger', 'noobs2ninjas', 'beohoff', 'brunofin', 'comster404', 'test_channel', 'cretetion', 'sheevergaming', 'TR7K', 'ESL_SC2'];
  const dummy = 'https://freecodecamp.codetabs.com/_assets/images/dumy.jpeg';
  let html = '';
  let action;

  function init () {
    document.getElementById('all').addEventListener('click', listChannels);
    document.getElementById('on').addEventListener('click', listChannels);
    document.getElementById('off').addEventListener('click', listChannels);
  }

  function listChannels (e) {
    action = e.target.id;
    html = '';
    for (let i = 0; i < channels.length; i++) {
      const url = 'https://wind-bow.gomix.me/twitch-api/streams/' + channels[i] + '?callback=printChannel';
      const script = document.createElement('script');
      script.src = url;
      document.body.appendChild(script);
    }
  }

  function printChannel (data) {
    // console.log('1 --> ', data)
    if (data.stream !== null && data.stream !== undefined) {
      if (action === 'all' || action === 'on') {
        option1(data);
      }
    } else if (data.stream === null) {
      if (action === 'off' || action === 'all') {
        let channel = data._links.channel.split('/')[data._links.channel.split('/').length - 1];
        const url = 'https://wind-bow.gomix.me/twitch-api/channels/' + channel + '?callback=option2';
        const script = document.createElement('script');
        script.src = url;
        document.body.appendChild(script);
      }
    }
  }

  function option1 (data) {
    const logo = data.stream.channel.logo || dummy;
    const name = data.stream.channel.display_name;
    const url = data.stream.channel.url;
    const game = data.stream.game;
    const status = data.stream.channel.status;
    html += '<div class="channel">';
    html += '<img class="logo" src="' + logo + '" alt="logo"/>';
    html += '<span class="name">';
    html += '<a href="' + url + '" target="_blank">' + name + '</a>';
    html += '</span>';
    html += '<span>' + game + ' ' + status + '</span>';
    html += '</div>';
    document.getElementById('channels').innerHTML = html;
  }

  function option2 (data) {
    let name = data.display_name;
    const game = ''; // data.game
    const logo = data.logo || dummy;
    let url = data.url;
    let status = 'OFFLINE'; // data.status
    if (data.status === 422) {
      name = data.display_name;
      status = 'ACCOUNT CLOSED';
      url = '#';
    }
    html += '<div class="channel">';
    html += '<img class="logo" src="' + logo + '" alt="logo"/>';
    html += '<span class="name">';
    html += '<a href="' + url + '" target="_blank">' + name + '</a>';
    html += '</span>';
    html += '<span>' + game + ' ' + status + '</span>';
    html += '</div>';
    document.getElementById('channels').innerHTML = html;
  }

  window.addEventListener('load', init);
}
