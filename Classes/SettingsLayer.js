var SettingsLayer = function(){
    this._layer = new cc.Layer();
    this.init = function () {
        var bRet = false;
        if (this._layer.init()) {
            var sp = cc.Sprite.create(s_loading);
            sp.setAnchorPoint(cc.PointZero());
            this._layer.addChild(sp, 0, 1);

            var cacheImage = cc.TextureCache.sharedTextureCache().addImage(s_menuTitle)
            var title = cc.Sprite.createWithTexture(cacheImage, cc.RectMake(0, 0, 134, 34));
            title.setPosition(cc.ccp(winSize.width / 2, winSize.height - 120));
            this._layer.addChild(title);

            cc.MenuItemFont.setFontName("Arial");
            cc.MenuItemFont.setFontSize(18);
            var title1 = cc.MenuItemFont.create("Sound");
            title1.setIsEnabled(false);

            cc.MenuItemFont.setFontName("Arial");
            cc.MenuItemFont.setFontSize(26);
            var item1 = cc.MenuItemToggle.create(this, this.soundControl,
                cc.MenuItemFont.create("On"), cc.MenuItemFont.create("Off"));

            cc.MenuItemFont.setFontName("Arial");
            cc.MenuItemFont.setFontSize(18);
            var title2 = cc.MenuItemFont.create("Mode");
            title2.setIsEnabled(false);

            cc.MenuItemFont.setFontName("Arial");
            cc.MenuItemFont.setFontSize(26);
            var item2 = cc.MenuItemToggle.create(this, this.modeControl,
                cc.MenuItemFont.create("Easy"),
                cc.MenuItemFont.create("Normal"),
                cc.MenuItemFont.create("Hard"));


            cc.MenuItemFont.setFontName("Arial");
            cc.MenuItemFont.setFontSize(26);
            var label = cc.LabelTTF.create("Go back", "Arial", 20);
            var back = cc.MenuItemLabel.create(label, this, this.backCallback);
            back.setScale(0.8);

            var menu = cc.Menu.create(title1, title2, item1, item2, back);
            menu.alignItemsInColumns(2, 2, 1);
            this._layer.addChild(menu);

            var cp_back = back.getPosition();
            cp_back.y -= 50.0;
            back.setPosition(cp_back);

            bRet = true;
        }

        return bRet;
    };
    this.backCallback = function (pSender) {
        var scene = cc.Scene.create();
        scene.addChild(SysMenu.create());
        cc.Director.sharedDirector().replaceScene(cc.TransitionFade.create(1.2, scene));
    };
    this.soundControl = function(){
        global.sound = global.sound ? false : true;
        if(!global.sound){
            cc.AudioManager.sharedEngine().end();
        }
    };
    this.modeControl = function(){
    }
};

SettingsLayer.create = function () {
    var sg = new SettingsLayer();
    if (sg && sg.init()) {
        return sg._layer;
    }
    return null;
};