var exec = require('child_process').exec;

exports = module.exports = (filename, id) => {
	return new Promise((resolve, reject) => {
		var cmd = `cd ./archive/codelabs/ && mkdir ${id} && unzip ${filename} -d ./${id} && cd ./${id} && gitbook build && mv ./_book ../../../public/gitbook/${id}`
		exec(cmd, (error, stdout, stderr) => {
			// console.log(stdout)
			if (error) {
				reject(error)
			} else {
				resolve()
			}
		})
	})
}
