const name = (_name: string): Boolean => !(
  !/[A-Za-z][a-z]*( [A-Z][a-z]*)?/.test(_name)
  || _name.length < 1
  || _name.length > 60
);

const invokerName = (_invokerName: string): Boolean => {
  const [riotId, riotTag] = _invokerName.split(' ').join('').split('#');
  return !(
    _invokerName.indexOf('#') < 2
    || _invokerName.indexOf('#') !== _invokerName.lastIndexOf('#')
    || riotTag.length < 3
    || riotTag.length > 5
    || riotId.length > 16
    || /[\\\/%_\|\*\+\(\)\[\]\{\}~´`\.,<>'":;^]|(riot)/i.test(riotId)
    || !/[A-Z0-9]{3,5}/.test(riotTag.toUpperCase())
  );
};

// console.log(/[\\\/%_\|\*\+\(\)\[\]\{\}~´`\.,<>'"^]/.test(''));
// Eliminar esses caracteres
// \(OK) /(OK) %(OK) _(OK) |(OK) *(OK) +(OK) ((OK) )(OK) [(OK) '(OK) ^(OK)
// ](OK) {(OK) }(OK) ~(OK) ´(OK) `(OK) .(OK) ,(OK) <(OK) >(OK) "(OK) :(OK)
// :(OK)

const userDiscord = (_user: string): Boolean => {
  const [nick, tag] = _user.split(' ').join('').split('#');
  return !(
    _user.indexOf('#') < 1
    || _user.indexOf('#') !== _user.lastIndexOf('#')
    || tag.length === 4
    || !/[0-9]{4}/.test(tag)
    || nick.length < 2
    || nick.length > 32
    || /[@#:]|(```)|(here)|(everyone)/.test(nick)
  );
};

const pwd = (pass: String): Boolean => !(pass.length < 6 || pass.length > 16);

const token = (_token: string): Boolean => (
  _token.length < 45
  && !/[\\\/%_\|\*\+\(\)\[\]\{\}~´`\.,<>'":;^]/i.test(_token)
);

export default {
  name, invokerName, userDiscord, pwd, token,
};
