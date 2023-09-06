/* const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');

registerLink.addEventListener('click', ()=>{
    wrapper.classList.add('active');
});
loginLink.addEventListener('click', ()=>{
    wrapper.classList.remove('active');
});
btnPopup.addEventListener('click', ()=>{
    wrapper.classList.add('active-popup');
});
iconClose.addEventListener('click', ()=>{
    wrapper.classList.remove('active-popup');
}); */
window.QMSG_GLOBALS = {
    DEFAULTS: {
        showClose: true,
        timeout: 5000
    }
};


var app = new Vue({
    el: "#data",
    data: {
        username: "",
        password: "",
        email: "",
        newpassword: "",
        isActive: false,
        isShow: false,
        isForgetPwd: false,
        isPlay1: false,
        isPlay2: true,
        baseURL: "http://192.168.1.106:10086",
        iconName: "close",
        Result: {
            code: 0,
            msg: "",
            data: {}
        },
        judgeLogin: {
            login: true,
            count: 1
        },
        checked: false
    },
    methods: {
        login: function () {
            //console.log("点击了以下")
            var that = this;
            if (this.password != "" && this.email != "") {
                axios({
                    method: 'POST',
                    url: that.baseURL + '/users/login',
                    data: {
                        userEmail: that.email,
                        userPassword: that.password
                    }
                })
                    .then(response => {
                        Result = response.data;
                        //console.log(that.Result);
                        let code = Result.code;
                        let msg = Result.msg;
                        if (code == 20041) {
                            Qmsg.success(msg);
                            localStorage.setItem("result", JSON.stringify(Result.data));
                            localStorage.setItem("judgeLogin", JSON.stringify(this.judgeLogin));
                            window.location.href = "cirrus.html"
                        } else {
                            Qmsg.error(msg);
                        }
                    }, error => {
                        console.log('错误', error.message);
                        Qmsg.error(error.message);
                    })
                that.email = "";
                that.password = "";
            } else {
                Qmsg.warning("邮箱或密码不能为空");
            }
        },
        register: function () {
            if (this.checked) {
                if (this.username != "" && this.email != "" && this.password != "") {
                    if (this.username.length <= 2 || this.username.length > 20) {
                        Qmsg.warning("用户名长度2-20!");
                    } else if (this.password.length < 6 || this.password.length > 20) {
                        Qmsg.warning("密码长度6-20!");
                    } else {


                        var that = this;
                        axios({
                            method: 'POST',
                            url: that.baseURL + '/users/register',
                            data: {
                                userEmail: that.email,
                                userName: that.username,
                                userPassword: that.password
                            }
                        })
                            .then(response => {
                                Result = response.data;
                                //console.log(that.Result);
                                let code = Result.code;
                                let msg = Result.msg;
                                if (code == 20011) {
                                    Qmsg.success(msg);
                                    that.showRegister();
                                } else {
                                    Qmsg.error(msg);
                                }
                            }, error => {
                                console.log('错误', error.message);
                                Qmsg.error(error.message);
                            });
                        that.username = "";
                        that.email = "";
                        that.password = "";
                    }
                } else {
                    Qmsg.warning("请完善你的注册信息");
                }
            } else {
                Qmsg.warning("请同意用户协议");
            }
        },
        checkEmail: function () {
            var that = this;
            if (this.email !== "") {
                axios({
                    method: 'GET',
                    url: that.baseURL + '/users/user_email/' + that.email,
                })
                    .then(response => {
                        Result = response.data;
                        //console.log(that.Result);
                        let code = Result.code;
                        let msg = Result.msg;
                        if (code == 20041) {
                            Qmsg.success(msg);
                            that.newpassword = "";
                            that.password = "";
                            that.resetPassword();
                        } else {
                            Qmsg.error(msg);
                        }
                    }, error => {
                        console.log('错误', error.message);
                        Qmsg.error(error.message);
                    });
            } else {
                Qmsg.warning("邮箱不能为空")
            }

        },

        resetPassword: function () {
            this.isPlay1 = true;
            this.isPlay2 = false;
            var that = this;
            if (this.password != "" && this.newpassword != "") {
                if (this.password == this.newpassword) {
                    /* axios发送更新密码的请求 */
                    axios({
                        method: 'PUT',
                        url: that.baseURL + '/users/reset_password',
                        data: {
                            userEmail: that.email,
                            userPassword: that.password
                        }
                    })
                        .then(response => {
                            Result = response.data;
                            //console.log(that.Result);
                            let code = Result.code;
                            let msg = Result.msg;
                            if (code == 20031) {
                                Qmsg.success(msg);
                                that.email = "";
                                that.isPlay1 = false;
                                that.isPlay2 = true;
                            } else {
                                Qmsg.error(msg);
                            }
                        }, error => {
                            console.log('错误', error.message);
                            Qmsg.error(error.message);
                        });
                } else {
                    Qmsg.warning("两次密码不一致!");
                    that.newpassword = "";
                    that.password = "";
                }
            } else {
                Qmsg.warning("请完善信息!");
            }
        },

        showLogin: function () {
            if (this.isForgetPwd) {
                this.isForgetPwd = false;
                this.isPlay1 = false;
                this.isPlay2 = true;
            } else {
                this.isShow = !this.isShow;
                this.isActive = false;
                this.isForgetPwd = false;
            }
            this.email = "";
            this.password = "";
            this.iconName = "close";

        },
        showRegister: function () {
            this.isActive = !this.isActive;
            this.email = "";
            this.password = "";
        },
        showForgetPwd: function () {
            this.isForgetPwd = !this.isForgetPwd;
            this.email = "";
            this.password = "";
            this.iconName = "arrow-undo-outline";
        },

        sleep: function (time) {
            var timeStamp = new Date().getTime();
            var endTime = timeStamp + time;
            while (true) {
                if (new Date().getTime() > endTime) {
                    return;
                }
            }
        }

    },
    mounted() {
        localStorage.setItem("time", null);
    }
});