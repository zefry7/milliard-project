const LOCAL = 'local';
const FTP = 'ftp';
const SFTP = 'sftp';

function getTasks({type, host, port, user, pass, passphrase, dir}) {
  switch (type) {
    case LOCAL:
      return sb(dir);
    case FTP:
      return ftp(dir, {
        host,
        port: port || 21,
        user,
        pass,
        parallel: 10
      });
    case SFTP:
      return sftp({
        host,
        port: port || 22,
        user,
        pass,
        remotePath: dir,
        // key: argv("key", "\\\\diskstation\\project_mats\\security\\keys\\peppers_rsa_openssh")
      });
      break;
  }
}

module.exports = getTasks;



/***
 *    ███████╗███████╗████████╗██████╗
 *    ██╔════╝██╔════╝╚══██╔══╝██╔══██╗
 *    ███████╗█████╗     ██║   ██████╔╝
 *    ╚════██║██╔══╝     ██║   ██╔═══╝
 *    ███████║██║        ██║   ██║
 *    ╚══════╝╚═╝        ╚═╝   ╚═╝
 *
 */

function sftp(params){
  return require('gulp-sftp')(params);
}





/***
 *    ███████╗████████╗██████╗
 *    ██╔════╝╚══██╔══╝██╔══██╗
 *    █████╗     ██║   ██████╔╝
 *    ██╔══╝     ██║   ██╔═══╝
 *    ██║        ██║   ██║
 *    ╚═╝        ╚═╝   ╚═╝
 *
 */
// При отправке на diskstation по ftp неправильно обрабатывалось сообщение о несуществующем файле/папке
function ftp(remotePath, params){
  let conn = require('vinyl-ftp')
    .create(params);

  return [
    conn.newer(remotePath),
    conn.dest(remotePath)
  ];
}




/***
 *    ███████╗██████╗
 *    ██╔════╝██╔══██╗
 *    ███████╗██████╔╝
 *    ╚════██║██╔══██╗
 *    ███████║██████╔╝
 *    ╚══════╝╚═════╝
 *
 */
function sb(dir){
  return [
    fchownFix(),
    require('gulp').dest(dir)
  ];
  /**
   * Без этого gulp.dest пытается поменять владельца копируемых файлов и это у него не получается
   * @return {*}
   */
  function fchownFix(){
    return require('through2').obj(
      (file, enc, callback) => {
        file.stat.uid = file.stat.gid = -1;
        file.stat.atime =
        file.stat.mtime =
        file.stat.birthtime = new Date;
        callback(null, file);
      }
    );
  }
}
