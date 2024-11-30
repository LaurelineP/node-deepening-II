const useAPI = breed => `https://dog.ceo/api/breed/${breed}/images/random`
const INPUT_FILE = `${__dirname}/dog.txt`
const OUTPUT_FILE = `${__dirname}/dog-image.txt`



module.exports = {
	useAPI,
	INPUT_FILE,
	OUTPUT_FILE
}