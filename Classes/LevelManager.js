var LevelManager = function (gamedata) {
    this._currentLevel = Level1;
    this._gameLayer = gamedata._layer;

    this.setLevel = function (level) {
        for (var i = 0; i < level.enemies.length; i++) {
            this._currentLevel.enemies[i].ShowTime = this._minuteToSecond(this._currentLevel.enemies[i].ShowTime);
        }
    };

    this._minuteToSecond = function (minuteStr) {
        if (!minuteStr)
            return 0;
        if (typeof(minuteStr) != "number") {
            var mins = minuteStr.split(':');
            if (mins.length == 1) {
                return parseInt(mins[0]);
            } else {
                return parseInt(mins[0]) * 60 + parseInt(mins[1]);
            }
        }
        return minuteStr;
    };

    this.loadLevelResource = function (deltaTime) {
        //load enemy
        for (var i = 0; i < this._currentLevel.enemies.length; i++) {
            var selEnemy = this._currentLevel.enemies[i];
            if (selEnemy) {
                if (selEnemy.ShowType == "Once") {
                    if (selEnemy.ShowTime == deltaTime) {
                        for (var tIndex = 0; tIndex < selEnemy.Types.length; tIndex++) {
                            this.addEnemyToGameLayer(selEnemy.Types[tIndex]);
                        }
                    }
                } else if (selEnemy.ShowType == "Repeate") {
                    if (deltaTime % selEnemy.ShowTime == 0) {
                        for (var rIndex = 0; rIndex < selEnemy.Types.length; rIndex++) {
                            this.addEnemyToGameLayer(selEnemy.Types[rIndex]);
                        }
                    }
                }
            }
        }
    };

    this.addEnemyToGameLayer = function (enemyType) {
        var addEnemy = new Enemy(EnemyType[enemyType]);
        addEnemy.setPosition(cc.ccp(80 + (winSize.width - 160) * Math.random(), winSize.height));

        var offset, tmpAction;
        switch (addEnemy.moveType) {
            case global.moveType.Attack:
                offset = gamedata._ship.getPosition();
                tmpAction = cc.MoveTo.create(1, offset);
                break;
            case global.moveType.Vertical:
                offset = cc.ccp(0, -winSize.height - addEnemy.getContentSize().height);
                tmpAction = cc.MoveBy.create(4, offset);
                break;
            case global.moveType.Horizontal:
                offset = cc.ccp(0, -100 - 200 * Math.random());
                var a0 = cc.MoveBy.create(0.5, offset);
                var a1 = cc.MoveBy.create(1, cc.ccp(-50 - 100 * Math.random(), 0));
                var a2 = cc.DelayTime.create(1);
                var a3 = cc.MoveBy.create(1, cc.ccp(100 + 100 * Math.random(), 0));
                var onComplete = cc.CallFunc.create(addEnemy, function (pSender) {
                    pSender.runAction(cc.RepeatForever.create(
                        cc.Sequence.create(a2, a3.copy(), a2, a3.copy().reverse())
                    ));
                });
                tmpAction = cc.Sequence.create(a0, a1, onComplete);
                break;
            case global.moveType.Overlap:
                var newX = (addEnemy.getPosition().x <= winSize.width / 2) ? 320 : -320;
                var a0 = cc.MoveBy.create(4, cc.ccp(newX, -240));
                var a1 = cc.MoveBy.create(4, cc.ccp(-newX, -320));
                tmpAction = cc.Sequence.create(a0, a1);
                break;
        }

        this._gameLayer.addChild(addEnemy, addEnemy.zOrder, global.Tag.Enemy);
        global.enemyContainer.push(addEnemy);
        addEnemy.runAction(tmpAction);
    }

    //init
    if (!gamedata) {
        throw "gameLayer must be non-nil";
    }

    this.setLevel(this._currentLevel);
};