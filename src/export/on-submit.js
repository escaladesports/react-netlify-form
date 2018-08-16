/*global FormData:true*/
/*eslint no-undef: "error"*/
import fetch from 'isomorphic-fetch'

async function onSubmit(e) {
	e.preventDefault()
	if (!this.props.canSubmit) return
	if(this.honeypot.value){
		console.error(`Honeypot value is set. Cannot submit form.`)
		return
	}

	if (this.props.recaptcha) {
		if (this.props.recaptcha.size === `invisible`) {
			await this.recaptchaEl.execute()
		}
		if (!this.state.recaptchaValue) {
			return this.onError(this.props.recatpchaError)
		}
	}

	this.setState({
		loading: true,
		error: false,
		success: false,
	})

	let body = new FormData(this.form)

	let notValid = await this.props.validate(body)
	if (notValid) {
		return this.setState({
			loading: false,
			error: false,
			success: false,
		})
	}

	this.props.onSubmit(body)

	let res = await fetch(this.props.action, {
		method: `POST`,
		body,
	})
	if (res.status !== 200) {
		return this.onError(this.props.statusError)
	}
	this.onSuccess(body)
}

export default onSubmit