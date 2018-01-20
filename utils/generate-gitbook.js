var exec = require('child_process').exec;

exports = module.exports = (filename, id) => {
	return new Promise((resolve, reject) => {
		var cmd = `cd ./archive/codelabs/ && rm -rf ${id} && mkdir ${id} && unzip ${filename} -d ./${id} && cd ./${id} && gitbook build && rm -rf ../../../public/gitbook/${id} && mv ./_book ../../../public/gitbook/${id}`
		exec(cmd, (error, stdout, stderr) => {
			if (error) {
				console.log(stderr)
				reject(error)
			} else {
				resolve()
			}
		})
	})
}
