function Environment(){
    this.Elements2D = [];
    this.SelectableElements = [];
    this.GroundMatrix = [0, 0, 0, 80, -60, 0];//transX, transY, transZ, RotX, RotZ
    this.EventTarget = '';
    this.ClickedItem = null;
    this.SelectedItem = null;
    this.ground = document.getElementById('ground');
    this.GroundDim;
    this.BlocsSize;

    this.InsertBloc = function(event){
        this.BlocsSize = new BlocSize(Number(document.getElementById('bloc-size-X').value), Number(document.getElementById('bloc-size-Y').value), Number(document.getElementById('bloc-size-Z').value));
        var _NewItem = null;
        if(this.SelectedItem != null){
            if(this.SelectedItem.BlocType == '3D'){
                if(event.button == 0){
                    _NewItem = new Cube(this, this.SelectedItem, 0, 0, 0, this.BlocsSize);
                }
                else{
                    if(event.button == 1){
                        _NewItem = new ItemFlat(this, this.SelectedItem, 0, 0, 0, this.BlocsSize);
                    }
                }
            }
            else{
                if(event.button == 0){
                    _NewItem = new Item2D(this, this.SelectedItem, 0, 0, 0, this.BlocsSize);
                }
            }
            if(_NewItem != null){
                if(event.target == this.ground){
                    _NewItem.X = Math.floor(event.offsetX / _NewItem.Dim.DimX) * _NewItem.Dim.DimX;
                    _NewItem.Y = Math.floor(event.offsetY / _NewItem.Dim.DimY) * _NewItem.Dim.DimY;
                }
                else{
                    if(this.SelectedItem.BlocType == '3D'){
                        switch(this.EventTarget){
                            case 'left':
                                _NewItem.X = this.ClickedItem.X - _NewItem.Dim.DimX;
                                _NewItem.Y = this.ClickedItem.Y + (this.ClickedItem.Dim.DimY / 2) - (_NewItem.Dim.DimY / 2);
                                _NewItem.Z = this.ClickedItem.Z + (this.ClickedItem.Dim.DimZ / 2) - (_NewItem.Dim.DimZ / 2);
                                break;
                            case 'right':
                                _NewItem.X = this.ClickedItem.X + this.ClickedItem.Dim.DimX;
                                _NewItem.Y = this.ClickedItem.Y + (this.ClickedItem.Dim.DimY / 2) - (_NewItem.Dim.DimY / 2);
                                _NewItem.Z = this.ClickedItem.Z + (this.ClickedItem.Dim.DimZ / 2) - (_NewItem.Dim.DimZ / 2);
                                break;
                            case 'front':
                                _NewItem.X = this.ClickedItem.X + (this.ClickedItem.Dim.DimX / 2) - (_NewItem.Dim.DimX / 2);
                                _NewItem.Y = this.ClickedItem.Y + this.ClickedItem.Dim.DimY;
                                _NewItem.Z = this.ClickedItem.Z + (this.ClickedItem.Dim.DimZ / 2) - (_NewItem.Dim.DimZ / 2);
                                break;
                            case 'back':
                                _NewItem.X = this.ClickedItem.X + (this.ClickedItem.Dim.DimX / 2) - (_NewItem.Dim.DimX / 2);
                                _NewItem.Y = this.ClickedItem.Y - _NewItem.Dim.DimY;
                                _NewItem.Z = this.ClickedItem.Z + (this.ClickedItem.Dim.DimZ / 2) - (_NewItem.Dim.DimZ / 2);
                                break;
                            case 'bottom':
                                _NewItem.X = this.ClickedItem.X + (this.ClickedItem.Dim.DimX / 2) - (_NewItem.Dim.DimX / 2);
                                _NewItem.Y = this.ClickedItem.Y + (this.ClickedItem.Dim.DimY / 2) - (_NewItem.Dim.DimY / 2);
                                _NewItem.Z = this.ClickedItem.Z - _NewItem.Dim.DimZ;
                                break;
                        }
                    }
                    switch(this.EventTarget){
                        case 'top':
                            _NewItem.X = this.ClickedItem.X + (this.ClickedItem.Dim.DimX / 2) - (_NewItem.Dim.DimX / 2);
                            _NewItem.Y = this.ClickedItem.Y + (this.ClickedItem.Dim.DimY / 2) - (_NewItem.Dim.DimY / 2);
                            _NewItem.Z = this.ClickedItem.Z + this.ClickedItem.Dim.DimZ;
                            break;
                    }
                }
                if(this.SelectedItem.BlocType == '2D'){
                    this.Elements2D.push(_NewItem);
                }
                this.ground.appendChild(_NewItem.MakeItem());
            }
        }
    };

    this.centerGround = function(){
        this.ground.style.left = (document.body.getBoundingClientRect().width / 2) - (this.GroundDim / 2) + 'px';
        this.ground.style.top = (document.body.getBoundingClientRect().height / 2) - (this.GroundDim / 2) + 'px';
    };

    this.EnvInitiate = function(){
        this.ground.addEventListener('mouseup', this.InsertBloc.bind(this), false);
        document.getElementById('ground-size').addEventListener('keyup', this.GroundUpdate.bind(this), false);
        document.getElementById('ground-texture').addEventListener('click', this.ApplyTextToGround.bind(this), false);
        this.BuildBlocsSelection();
        this.GroundUpdate();
    };

    this.BuildBlocsSelection = function(){
        for(var i = 0 ; i < Blocs.length ; i++){
            var _Option = new BlocSelection(this, Blocs[i].Name);
            document.getElementById('textures').appendChild(_Option.MakeItemSelection());
            this.SelectableElements.push(_Option);
        }
    };

    this.ApplyTextToGround = function(){
        if(this.SelectedItem != null){
            this.ground.style.backgroundImage = 'url("../images/textures/' + this.SelectedItem.TextureTop + '")';
        }
    };

    this.GroundUpdate = function(){
        this.GroundDim = Number(document.getElementById('ground-size').value);
        this.centerGround();
        this.ground.style.transform = 'translate3d(' + this.GroundMatrix[0] + 'px, ' + this.GroundMatrix[1] + 'px, ' + this.GroundMatrix[2] + 'px) rotate3d(1, 0, 0, ' + this.GroundMatrix[3] + 'deg) rotate3d(0, 0, 1, ' + this.GroundMatrix[4] + 'deg)';
        this.ground.style.width = this.GroundDim + 'px';
        this.ground.style.height = this.GroundDim + 'px';
        for(var i = 0 ; i < this.Elements2D.length ; i++){
            this.Elements2D[i].UpdateItem2D();
        }
    };
}

function BlocSelection(Environment, Name){
    this.Environment = Environment;
    this.Name = Name;
    this.ItemSelection = null;

    this.MakeItemSelection = function(){
        this.ItemSelection = this.GetItemFromList(this.Name);
        this.Item = document.createElement('div');
        this.Item.className = 'texture-item';
        var _ItemPic = document.createElement('img');
        _ItemPic.src = 'images/textures/' + this.ItemSelection.TextureFront;
        this.Item.appendChild(_ItemPic);
        this.Item.addEventListener('click', this.WriteSelectedTexture.bind(this), false);
        return this.Item;
    };

    this.WriteSelectedTexture = function(){
        for(var i = 0 ; i < this.Environment.SelectableElements.length ; i++){
            this.Environment.SelectableElements[i].Item.classList.remove('selected-texture');
        }
        this.Environment.SelectedItem = this.ItemSelection;
        this.Item.classList.add('selected-texture');
    }

    this.GetItemFromList = function(ItemName){
        var _Index = 0;
        while(Blocs[_Index].Name != ItemName){
            _Index++;
        }
        return Blocs[_Index];
    };    
}

function BlocSize(DimX, DimY, DimZ){
    this.DimX = DimX;
    this.DimY = DimY;
    this.DimZ = DimZ;
}

this.Item = function(Environment, ItemElem, X, Y, Z, Dim){
    this.Environment = Environment;
    this.ItemElem = ItemElem;
    this.X = X;
    this.Y = Y;
    this.Z = Z;
    this.Dim = Dim;
    this.Opacity = 1;
}

function Cube(Environment, ItemElem, X, Y, Z, Dim){
    Item.call(this, Environment, ItemElem, X, Y, Z, Dim);
    this.RotateZ = 0;

    this.MakeItem = function(){
        if(this.ItemElem.Type == 'liquide'){
            this.Opacity = 0.8;
        }
        this.Cube = document.createElement('div');
        this.Cube.className = 'item cube';
        this.Cube.style.width = this.Dim.DimX + 'px';
        this.Cube.style.height = this.Dim.DimY + 'px';
        this.Cube.style.left = this.X + 'px';
        this.Cube.style.top = this.Y + 'px';
        this.Cube.style.transform = 'translateZ(' + this.Z + 'px)';
        if(this.Z == 0){
            this.Cube.classList.add('cast-shadow');
        }
        var _CubeFront = document.createElement('div');
        _CubeFront.style.width = this.Dim.DimX + 'px';
        _CubeFront.style.height = this.Dim.DimZ + 'px';
        _CubeFront.className = 'cube-face front';
        _CubeFront.style.transform = 'rotateX(-90deg)';
        _CubeFront.style.backgroundImage = 'url("../images/textures/' + this.ItemElem.TextureFront + '")';
        _CubeFront.style.opacity = this.Opacity;
        var _CubeBack = _CubeFront.cloneNode();
        _CubeBack.className = 'cube-face back';
        _CubeBack.style.transform = 'rotateX(-90deg) rotateY(180deg) translateY(-' + this.Dim.DimZ + 'px)';
        _CubeBack.style.backgroundImage = 'url("../images/textures/' + this.ItemElem.TextureBack + '")';
        var _CubeLeft = document.createElement('div');
        _CubeLeft.style.width = this.Dim.DimY + 'px';
        _CubeLeft.style.height = this.Dim.DimZ + 'px';
        _CubeLeft.className = 'cube-face left';
        _CubeLeft.style.transform = 'rotateY(90deg) rotateZ(-90deg) rotateY(180deg) translateY(-' + this.Dim.DimZ + 'px)';
        _CubeLeft.style.backgroundImage = 'url("../images/textures/' + this.ItemElem.TextureLeft + '")';
        _CubeLeft.style.opacity = this.Opacity;
        var _CubeRight = _CubeLeft.cloneNode();
        _CubeRight.className = 'cube-face right';
        _CubeRight.style.transform = 'rotateY(90deg) rotateZ(-90deg) translateX(-' + this.Dim.DimY + 'px) translateY(-' + this.Dim.DimZ + 'px) translateZ(' + this.Dim.DimX + 'px)';
        _CubeRight.style.backgroundImage = 'url("../images/textures/' + this.ItemElem.TextureRight + '")';
        var _CubeBottom = document.createElement('div');
        _CubeBottom.className = 'cube-face bottom';
        _CubeBottom.style.width = this.Dim.DimX + 'px';
        _CubeBottom.style.height = this.Dim.DimY + 'px';
        _CubeBottom.style.backgroundImage = 'url("../images/textures/' + this.ItemElem.TextureBottom + '")';
        _CubeBottom.style.opacity = this.Opacity;
        var _CubeTop = document.createElement('div');
        _CubeTop = _CubeBottom.cloneNode();
        _CubeTop.className = 'cube-face top';
        _CubeTop.style.transform = 'translateZ(' + this.Dim.DimZ + 'px)';
        _CubeTop.style.backgroundImage = 'url("../images/textures/' + this.ItemElem.TextureTop + '")';
        var _DimsLabel = document.createElement('div');
        _DimsLabel.className = "dims-label";
        _DimsLabel.style.transform = 'translateZ(' + (this.Dim.DimZ + 30) + 'px) translateX(-50%) translateY(-50%)';
        _DimsLabel.innerHTML = '<span>' + this.Dim.DimX + '</span>&nbsp;<span>' + this.Dim.DimY + '</span>&nbsp;<span>' + this.Dim.DimZ + '</span>';
        this.Cube.appendChild(_CubeFront);
        this.Cube.appendChild(_CubeBack);
        this.Cube.appendChild(_CubeLeft);
        this.Cube.appendChild(_CubeRight);
        this.Cube.appendChild(_CubeTop);
        this.Cube.appendChild(_CubeBottom);
        this.Cube.appendChild(_DimsLabel);
        this.Cube.addEventListener('mouseup', this.ClickItem.bind(this), false);
        document.addEventListener('contextmenu', function(event){event.preventDefault();}, true);
        return this.Cube;
    };

    this.ClickItem = function(event){
        switch(event.button){
            case 0:
                this.Environment.ClickedItem = this;
                if(event.target.className.search('top') != -1){
                    this.Environment.EventTarget = 'top';
                }
                if(event.target.className.search('back') != -1){
                    this.Environment.EventTarget = 'back';
                }
                if(event.target.className.search('front') != -1){
                    this.Environment.EventTarget = 'front';
                }
                if(event.target.className.search('bottom') != -1){
                    this.Environment.EventTarget = 'bottom';
                }
                if(event.target.className.search('left') != -1){
                    this.Environment.EventTarget = 'left';
                }
                if(event.target.className.search('right') != -1){
                    this.Environment.EventTarget = 'right';
                }
                break;
            case 1:
                event.stopPropagation();
                this.RotateZ += 90;
                this.Cube.style.transform = 'translateZ(' + this.Z + 'px) rotateZ(' + this.RotateZ + 'deg)';
                break;
            case 2:
                this.Cube.remove();
                break;
        }
    };
}
Cube.prototype = Object.create(Item.prototype);
Cube.prototype.constructor = Cube;

function Item2D(Environment, ItemElem, X, Y, Z, Dim){
    Item.call(this, Environment, ItemElem, X, Y, Z, Dim);

    this.MakeItem = function(){
        this.Item = document.createElement('div');
        this.Item.className = 'item item2d';
        this.Item.style.backgroundImage = 'url("../images/textures/' + this.ItemElem.TextureFront + '")';
        this.Item.style.transform = 'rotate3d(1, 0, 0, -90deg) translateY(-' + (this.Z + (this.Dim.DimX / 2)) + 'px)';
        this.Item.style.width = this.Dim.DimX + 'px';
        this.Item.style.height = this.Dim.DimX + 'px';
        this.Item.style.left = this.X + 'px';
        this.Item.style.top = this.Y + 'px';
        this.Item.addEventListener('mouseup', this.ClickItem.bind(this), false);
        document.addEventListener('contextmenu', function(event){event.preventDefault();}, true);
        return this.Item;
    };

    this.UpdateItem2D = function(){
        if(this.ItemElem.FaceToCam){
            this.Item.style.transform = 'rotate3d(1, 0, 0, -90deg) rotate3d(0, 1, 0, ' + this.Environment.GroundMatrix[4] + 'deg) translateY(-' + (this.Z + (this.Dim.DimX / 2)) + 'px)';
        }
    }

    this.ClickItem = function(event){
        if(event.button == 2){
            var _Index = 0;
            while(this.Environment.Elements2D[_Index] != this){
                _Index++;
            }
            this.Environment.Elements2D.splice(_Index, 1);
            this.Item.remove();
        }
    };
}
Item2D.prototype = Object.create(Item.prototype);
Item2D.prototype.constructor = Item2D;

function ItemFlat(Environment, ItemElem, X, Y, Z, Dim){
    Item.call(this, Environment, ItemElem, X, Y, Z, Dim);

    this.MakeItem = function(){
        this.Item = document.createElement('div');
        this.Item.className = 'item';
        this.Item.style.backgroundImage = 'url("../images/textures/' + this.ItemElem.TextureTop + '")';
        this.Item.style.width = this.Dim.DimX + 'px';
        this.Item.style.height = this.Dim.DimX + 'px';
        this.Item.style.left = this.X + 'px';
        this.Item.style.top = this.Y + 'px';
        this.Item.addEventListener('mouseup', this.ClickItem.bind(this), false);
        document.addEventListener('contextmenu', function(event){event.preventDefault();}, true);
        return this.Item;
    };

    this.ClickItem = function(event){
        if(event.button == 2){
            this.Item.remove();
        }
    };
}
ItemFlat.prototype = Object.create(Item.prototype);
ItemFlat.prototype.constructor = ItemFlat;