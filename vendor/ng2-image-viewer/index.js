import { Component, EventEmitter, Input, NgModule, Output, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import ImageViewer, { FullScreenViewer } from 'iv-viewer';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @author Breno Prata - 22/12/2017
 */
var ImageViewerComponent = (function () {
    function ImageViewerComponent(renderer) {
        this.renderer = renderer;
        this.BASE_64_IMAGE = 'data:image/png;base64,';
        this.BASE_64_PNG = this.BASE_64_IMAGE + " ";
        this.ROTACAO_PADRAO_GRAUS = 90;
        this.rotate = true;
        this.download = true;
        this.fullscreen = true;
        this.resetZoom = true;
        this.loadOnInit = false;
        this.showOptions = true;
        this.zoomInButton = true;
        this.zoomOutButton = true;
        this.showPDFOnlyOption = true;
        this.primaryColor = '#0176bd';
        this.buttonsColor = 'white';
        this.buttonsHover = '#333333';
        this.defaultDownloadName = 'Image';
        this.rotateRightTooltipLabel = 'Rotate right';
        this.rotateLeftTooltipLabel = 'Rotate left';
        this.resetZoomTooltipLabel = 'Reset zoom';
        this.fullscreenTooltipLabel = 'Fullscreen';
        this.zoomInTooltipLabel = 'Zoom In';
        this.zoomOutTooltipLabel = 'Zoom Out';
        this.downloadTooltipLabel = 'Download';
        this.showPDFOnlyLabel = 'Show only PDF';
        this.openInNewTabTooltipLabel = 'Open in new tab';
        this.enableTooltip = true;
        this.onNext = new EventEmitter();
        this.onPrevious = new EventEmitter();
        this.showOnlyPDF = false;
        this.zoomPercent = 100;
    }
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        if (this.loadOnInit) {
            this.isImagensPresentes();
        }
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.inicializarCores();
        if (this.loadOnInit) {
            this.inicializarImageViewer();
            setTimeout(function () {
                _this.showImage();
            }, 1000);
        }
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.inicializarCores = /**
     * @return {?}
     */
    function () {
        this.setStyleClass('inline-icon', 'background-color', this.primaryColor);
        this.setStyleClass('footer-info', 'background-color', this.primaryColor);
        this.setStyleClass('footer-icon', 'color', this.buttonsColor);
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    ImageViewerComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        this.imagesChange(changes);
        this.primaryColorChange(changes);
        this.buttonsColorChange(changes);
        this.defaultDownloadNameChange(changes);
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.zoomIn = /**
     * @return {?}
     */
    function () {
        this.zoomPercent += 10;
        this.viewer.zoom(this.zoomPercent);
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.zoomOut = /**
     * @return {?}
     */
    function () {
        if (this.zoomPercent === 100) {
            return;
        }
        this.zoomPercent -= 10;
        if (this.zoomPercent < 0) {
            this.zoomPercent = 0;
        }
        this.viewer.zoom(this.zoomPercent);
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    ImageViewerComponent.prototype.primaryColorChange = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        var _this = this;
        if (changes['primaryColor'] || changes['showOptions']) {
            setTimeout(function () {
                _this.setStyleClass('inline-icon', 'background-color', _this.primaryColor);
                _this.setStyleClass('footer-info', 'background-color', _this.primaryColor);
            }, 350);
        }
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    ImageViewerComponent.prototype.buttonsColorChange = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        var _this = this;
        if (changes['buttonsColor'] || changes['rotate'] || changes['download']
            || changes['fullscreen']) {
            setTimeout(function () {
                _this.setStyleClass('footer-icon', 'color', _this.buttonsColor);
            }, 350);
        }
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    ImageViewerComponent.prototype.defaultDownloadNameChange = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (changes['defaultDownloadName']) {
            this.defaultDownloadName = this.defaultDownloadName;
        }
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    ImageViewerComponent.prototype.imagesChange = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        var _this = this;
        if (changes['images'] && this.isImagensPresentes()) {
            this.inicializarImageViewer();
            setTimeout(function () {
                _this.showImage();
            }, 1000);
        }
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.isImagensPresentes = /**
     * @return {?}
     */
    function () {
        return this.images
            && this.images.length > 0;
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.inicializarImageViewer = /**
     * @return {?}
     */
    function () {
        this.indexImagemAtual = 1;
        this.rotacaoImagemAtual = 0;
        this.totalImagens = this.images.length;
        if (this.viewer) {
            this.wrapper.querySelector('.total').innerHTML = this.totalImagens;
            return;
        }
        this.wrapper = document.getElementById("" + this.idContainer);
        if (this.wrapper) {
            this.curSpan = this.wrapper.querySelector('#current');
            this.viewer = new ImageViewer(this.wrapper.querySelector('.image-container'));
            this.wrapper.querySelector('.total').innerHTML = this.totalImagens;
        }
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.showImage = /**
     * @return {?}
     */
    function () {
        this.prepararTrocaImagem();
        var /** @type {?} */ imgObj = this.BASE_64_PNG;
        if (this.isPDF()) {
            this.carregarViewerPDF();
        }
        else if (this.isURlImagem()) {
            imgObj = this.getImagemAtual();
            this.stringDownloadImagem = this.getImagemAtual();
        }
        else {
            imgObj = this.BASE_64_PNG + this.getImagemAtual();
            this.stringDownloadImagem = this.BASE_64_IMAGE + this.getImagemAtual();
        }
        this.viewer.load(imgObj, imgObj);
        this.curSpan.innerHTML = this.indexImagemAtual;
        this.inicializarCores();
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.carregarViewerPDF = /**
     * @return {?}
     */
    function () {
        this.esconderBotoesImageViewer();
        var _a = this.getTamanhoIframe(), widthIframe = _a.widthIframe, heightIframe = _a.heightIframe;
        this.injetarIframe(widthIframe, heightIframe);
    };
    /**
     * @param {?} widthIframe
     * @param {?} heightIframe
     * @return {?}
     */
    ImageViewerComponent.prototype.injetarIframe = /**
     * @param {?} widthIframe
     * @param {?} heightIframe
     * @return {?}
     */
    function (widthIframe, heightIframe) {
        var /** @type {?} */ ivImageWrap = document.getElementsByClassName('iv-image-wrap').item(0);
        var /** @type {?} */ iframe = document.createElement('iframe');
        iframe.id = this.getIdIframe();
        iframe.style.width = widthIframe + "px";
        iframe.style.height = heightIframe + "px";
        iframe.src = "" + this.converterPDFBase64ParaBlob();
        this.renderer.appendChild(ivImageWrap, iframe);
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.getTamanhoIframe = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ container = document.getElementById(this.idContainer);
        var /** @type {?} */ widthIframe = container.offsetWidth;
        var /** @type {?} */ heightIframe = container.offsetHeight;
        return { widthIframe: widthIframe, heightIframe: heightIframe };
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.esconderBotoesImageViewer = /**
     * @return {?}
     */
    function () {
        this.setStyleClass('iv-loader', 'visibility', 'hidden');
        this.setStyleClass('options-image-viewer', 'visibility', 'hidden');
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.isPDF = /**
     * @return {?}
     */
    function () {
        return this.getImagemAtual().startsWith('JVBE') || this.getImagemAtual().startsWith('0M8R');
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.isURlImagem = /**
     * @return {?}
     */
    function () {
        return this.getImagemAtual().match(new RegExp(/^(https|http|www\.)/g));
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.prepararTrocaImagem = /**
     * @return {?}
     */
    function () {
        this.rotacaoImagemAtual = 0;
        this.limparCacheElementos();
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.limparCacheElementos = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ container = document.getElementById(this.idContainer);
        var /** @type {?} */ iframeElement = document.getElementById(this.getIdIframe());
        var /** @type {?} */ ivLargeImage = document.getElementsByClassName('iv-large-image').item(0);
        if (iframeElement) {
            this.renderer.removeChild(container, iframeElement);
            if (ivLargeImage) {
                this.renderer.removeChild(container, ivLargeImage);
            }
        }
        this.setStyleClass('iv-loader', 'visibility', 'auto');
        this.setStyleClass('options-image-viewer', 'visibility', 'inherit');
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.proximaImagem = /**
     * @return {?}
     */
    function () {
        this.isImagemVertical = false;
        this.indexImagemAtual++;
        if (this.indexImagemAtual > this.totalImagens) {
            this.indexImagemAtual = 1;
        }
        this.onNext.emit(this.indexImagemAtual);
        if (!this.isPDF() && this.showOnlyPDF) {
            this.proximaImagem();
            return;
        }
        this.showImage();
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.imagemAnterior = /**
     * @return {?}
     */
    function () {
        this.isImagemVertical = false;
        this.indexImagemAtual--;
        if (this.indexImagemAtual <= 0) {
            this.indexImagemAtual = this.totalImagens;
        }
        this.onPrevious.emit(this.indexImagemAtual);
        if (!this.isPDF() && this.showOnlyPDF) {
            this.imagemAnterior();
            return;
        }
        this.showImage();
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.rotacionarDireita = /**
     * @return {?}
     */
    function () {
        var _this = this;
        var /** @type {?} */ timeout = this.resetarZoom();
        setTimeout(function () {
            _this.rotacaoImagemAtual += _this.ROTACAO_PADRAO_GRAUS;
            _this.isImagemVertical = !_this.isImagemVertical;
            _this.atualizarRotacao();
        }, timeout);
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.rotacionarEsquerda = /**
     * @return {?}
     */
    function () {
        var _this = this;
        var /** @type {?} */ timeout = this.resetarZoom();
        setTimeout(function () {
            _this.rotacaoImagemAtual -= _this.ROTACAO_PADRAO_GRAUS;
            _this.isImagemVertical = !_this.isImagemVertical;
            _this.atualizarRotacao();
        }, timeout);
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.resetarZoom = /**
     * @return {?}
     */
    function () {
        this.zoomPercent = 100;
        this.viewer.zoom(this.zoomPercent);
        var /** @type {?} */ timeout = 800;
        if (this.viewer._state.zoomValue === this.zoomPercent) {
            timeout = 0;
        }
        return timeout;
    };
    /**
     * @param {?=} isAnimacao
     * @return {?}
     */
    ImageViewerComponent.prototype.atualizarRotacao = /**
     * @param {?=} isAnimacao
     * @return {?}
     */
    function (isAnimacao) {
        if (isAnimacao === void 0) { isAnimacao = true; }
        var /** @type {?} */ scale = '';
        if (this.isImagemVertical && this.isImagemSobrepondoNaVertical()) {
            scale = "scale(" + this.getScale() + ")";
        }
        var /** @type {?} */ novaRotacao = "rotate(" + this.rotacaoImagemAtual + "deg)";
        this.carregarImagem(novaRotacao, scale, isAnimacao);
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.getScale = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ containerElement = document.getElementById(this.idContainer);
        var /** @type {?} */ ivLargeImageElement = document.getElementsByClassName('iv-large-image').item(0);
        var /** @type {?} */ diferencaTamanhoImagem = ivLargeImageElement.clientWidth - containerElement.clientHeight;
        if (diferencaTamanhoImagem >= 250 && diferencaTamanhoImagem < 300) {
            return (ivLargeImageElement.clientWidth - containerElement.clientHeight) / (containerElement.clientHeight) - 0.1;
        }
        else if (diferencaTamanhoImagem >= 300 && diferencaTamanhoImagem < 400) {
            return ((ivLargeImageElement.clientWidth - containerElement.clientHeight) / (containerElement.clientHeight)) - 0.15;
        }
        else if (diferencaTamanhoImagem >= 400) {
            return ((ivLargeImageElement.clientWidth - containerElement.clientHeight) / (containerElement.clientHeight)) - 0.32;
        }
        return 0.6;
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.isImagemSobrepondoNaVertical = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ margemErro = 5;
        var /** @type {?} */ containerElement = document.getElementById(this.idContainer);
        var /** @type {?} */ ivLargeImageElement = document.getElementsByClassName('iv-large-image').item(0);
        return containerElement.clientHeight < ivLargeImageElement.clientWidth + margemErro;
    };
    /**
     * @param {?} novaRotacao
     * @param {?} scale
     * @param {?=} isAnimacao
     * @return {?}
     */
    ImageViewerComponent.prototype.carregarImagem = /**
     * @param {?} novaRotacao
     * @param {?} scale
     * @param {?=} isAnimacao
     * @return {?}
     */
    function (novaRotacao, scale, isAnimacao) {
        var _this = this;
        if (isAnimacao === void 0) { isAnimacao = true; }
        if (isAnimacao) {
            this.adicionarAnimacao('iv-snap-image');
            this.adicionarAnimacao('iv-large-image');
        }
        this.adicionarRotacao('iv-snap-image', novaRotacao, scale);
        this.adicionarRotacao('iv-large-image', novaRotacao, scale);
        setTimeout(function () {
            if (isAnimacao) {
                _this.retirarAnimacao('iv-snap-image');
                _this.retirarAnimacao('iv-large-image');
            }
        }, 501);
    };
    /**
     * @param {?} componente
     * @return {?}
     */
    ImageViewerComponent.prototype.retirarAnimacao = /**
     * @param {?} componente
     * @return {?}
     */
    function (componente) {
        this.setStyleClass(componente, 'transition', 'auto');
    };
    /**
     * @param {?} componente
     * @param {?} novaRotacao
     * @param {?} scale
     * @return {?}
     */
    ImageViewerComponent.prototype.adicionarRotacao = /**
     * @param {?} componente
     * @param {?} novaRotacao
     * @param {?} scale
     * @return {?}
     */
    function (componente, novaRotacao, scale) {
        this.setStyleClass(componente, 'transform', novaRotacao + " " + scale);
    };
    /**
     * @param {?} componente
     * @return {?}
     */
    ImageViewerComponent.prototype.adicionarAnimacao = /**
     * @param {?} componente
     * @return {?}
     */
    function (componente) {
        this.setStyleClass(componente, 'transition', "0.5s linear");
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.mostrarFullscreen = /**
     * @return {?}
     */
    function () {
        var _this = this;
        var /** @type {?} */ timeout = this.resetarZoom();
        setTimeout(function () {
            _this.viewerFullscreen = new FullScreenViewer();
            var /** @type {?} */ imgSrc;
            if (_this.isURlImagem()) {
                imgSrc = _this.getImagemAtual();
            }
            else {
                imgSrc = _this.BASE_64_PNG + _this.getImagemAtual();
            }
            console.log("hola");
            _this.viewerFullscreen.show(imgSrc, imgSrc);
            _this.atualizarRotacao(false);
        }, timeout);
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.converterPDFBase64ParaBlob = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ arrBuffer = this.base64ToArrayBuffer(this.getImagemAtual());
        var /** @type {?} */ newBlob = new Blob([arrBuffer], { type: 'application/pdf' });
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
        }
        return window.URL.createObjectURL(newBlob);
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.getImagemAtual = /**
     * @return {?}
     */
    function () {
        return this.images[this.indexImagemAtual - 1];
    };
    /**
     * @param {?} data
     * @return {?}
     */
    ImageViewerComponent.prototype.base64ToArrayBuffer = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
        var /** @type {?} */ binaryString = window.atob(data);
        var /** @type {?} */ binaryLen = binaryString.length;
        var /** @type {?} */ bytes = new Uint8Array(binaryLen);
        for (var /** @type {?} */ i = 0; i < binaryLen; i++) {
            var /** @type {?} */ ascii = binaryString.charCodeAt(i);
            bytes[i] = ascii;
        }
        return bytes;
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.showPDFOnly = /**
     * @return {?}
     */
    function () {
        this.showOnlyPDF = !this.showOnlyPDF;
        this.proximaImagem();
    };
    /**
     * @param {?} nomeClasse
     * @param {?} nomeStyle
     * @param {?} cor
     * @return {?}
     */
    ImageViewerComponent.prototype.setStyleClass = /**
     * @param {?} nomeClasse
     * @param {?} nomeStyle
     * @param {?} cor
     * @return {?}
     */
    function (nomeClasse, nomeStyle, cor) {
        var /** @type {?} */ cont;
        var /** @type {?} */ listaElementos = document.getElementsByClassName(nomeClasse);
        for (cont = 0; cont < listaElementos.length; cont++) {
            this.renderer.setStyle(listaElementos.item(cont), nomeStyle, cor);
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    ImageViewerComponent.prototype.atualizarCorHoverIn = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.renderer.setStyle(event.srcElement, 'color', this.buttonsHover);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    ImageViewerComponent.prototype.atualizarCorHoverOut = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.renderer.setStyle(event.srcElement, 'color', this.buttonsColor);
    };
    /**
     * @return {?}
     */
    ImageViewerComponent.prototype.getIdIframe = /**
     * @return {?}
     */
    function () {
        return this.idContainer + '-iframe';
    };
    ImageViewerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'app-image-viewer',
                    template: "<div id=\"{{idContainer}}\" class=\"image-gallery-2\"> <div class=\"image-container\"></div> <div class=\"inline-icon\"> <div> <a class=\"image-viewer-tooltip\" (click)=\"showPDFOnly()\" *ngIf=\"showPDFOnlyOption\"> <span *ngIf=\"enableTooltip\" class=\"tooltiptext filterTooltip\"> <span>{{showPDFOnlyLabel}}:</span> <i class=\"material-icons\">{{showOnlyPDF ? 'check':'close'}}</i> </span> <i class=\"material-icons footer-icon\">picture_as_pdf</i> </a> </div> <div *ngIf=\"showOptions\" class=\"options-image-viewer\"> <a class=\"image-viewer-tooltip\" *ngIf=\"zoomInButton\" (click)=\"zoomIn()\"  (mouseover)=\"atualizarCorHoverIn($event)\" (mouseout)=\"atualizarCorHoverOut($event)\"> <span *ngIf=\"enableTooltip\" class=\"tooltiptext\">{{zoomInTooltipLabel}}</span> <i class=\"material-icons footer-icon\">zoom_in</i> </a> <a class=\"image-viewer-tooltip\" *ngIf=\"zoomOutButton\" (click)=\"zoomOut()\"  (mouseover)=\"atualizarCorHoverIn($event)\" (mouseout)=\"atualizarCorHoverOut($event)\"> <span *ngIf=\"enableTooltip\" class=\"tooltiptext\">{{zoomOutTooltipLabel}}</span> <i class=\"material-icons footer-icon\">zoom_out</i> </a> <a class=\"image-viewer-tooltip\" *ngIf=\"rotate\" (click)=\"rotacionarDireita()\"  (mouseover)=\"atualizarCorHoverIn($event)\" (mouseout)=\"atualizarCorHoverOut($event)\"> <span *ngIf=\"enableTooltip\" class=\"tooltiptext\">{{rotateRightTooltipLabel}}</span> <i class=\"material-icons footer-icon\">rotate_right</i> </a> <a class=\"image-viewer-tooltip\" *ngIf=\"rotate\" (click)=\"rotacionarEsquerda()\"  (mouseover)=\"atualizarCorHoverIn($event)\" (mouseout)=\"atualizarCorHoverOut($event)\"> <span *ngIf=\"enableTooltip\" class=\"tooltiptext\">{{rotateLeftTooltipLabel}}</span> <i class=\"material-icons footer-icon\">rotate_left</i> </a> <a class=\"image-viewer-tooltip\" *ngIf=\"resetZoom\" (click)=\"resetarZoom()\"  (mouseover)=\"atualizarCorHoverIn($event)\" (mouseout)=\"atualizarCorHoverOut($event)\"> <span *ngIf=\"enableTooltip\" class=\"tooltiptext\">{{resetZoomTooltipLabel}}</span> <i class=\"material-icons footer-icon\">fullscreen_exit</i> </a> <a class=\"image-viewer-tooltip\" *ngIf=\"fullscreen\" (click)=\"mostrarFullscreen()\"   (mouseover)=\"atualizarCorHoverIn($event)\" (mouseout)=\"atualizarCorHoverOut($event)\"> <span *ngIf=\"enableTooltip\" class=\"tooltiptext\">{{fullscreenTooltipLabel}}</span> <i class=\"material-icons footer-icon\">fullscreen</i> </a> <a class=\"image-viewer-tooltip\" target=\"_blank\" href=\"{{stringDownloadImagem}}\" download=\"{{defaultDownloadName}} {{indexImagemAtual}}.png\" *ngIf=\"download\" (mouseover)=\"atualizarCorHoverIn($event)\" (mouseout)=\"atualizarCorHoverOut($event)\"> <span *ngIf=\"enableTooltip\" class=\"tooltiptext\">{{isURlImagem() ? openInNewTabTooltipLabel : downloadTooltipLabel}}</span> <i class=\"material-icons footer-icon\">{{isURlImagem() ? 'open_in_browser' : 'file_download'}}</i> </a> </div> </div> <i class=\"material-icons prev\" (click)=\"imagemAnterior()\">keyboard_arrow_left</i> <i class=\"material-icons next\" (click)=\"proximaImagem()\">keyboard_arrow_right</i> <div class=\"footer-info\"> <span id=\"current\"></span>/<span class=\"total\"></span> </div> </div> ",
                    styles: [".footer-icon { font-size: xx-large; } .image-viewer-tooltip { position: relative; display: inline-block; z-index: 1000; } .image-viewer-tooltip .tooltiptext { visibility: hidden; width: 120px; background-color: #555; color: #fff; text-align: center; border-radius: 6px; padding: 5px 0; position: absolute; z-index: 1; bottom: 125%; left: 40%; margin-left: -60px; opacity: 0; transition: opacity 0.3s; } .image-viewer-tooltip .tooltiptext::after { content: \"\"; position: absolute; top: 100%; left: 50%; margin-left: -5px; border-width: 5px; border-style: solid; border-color: #555 transparent transparent transparent; } .image-viewer-tooltip:hover .tooltiptext { visibility: visible; opacity: 1; } "]
                },] },
    ];
    /** @nocollapse */
    ImageViewerComponent.ctorParameters = function () { return [
        { type: Renderer2, },
    ]; };
    ImageViewerComponent.propDecorators = {
        "idContainer": [{ type: Input },],
        "images": [{ type: Input },],
        "rotate": [{ type: Input },],
        "download": [{ type: Input },],
        "fullscreen": [{ type: Input },],
        "resetZoom": [{ type: Input },],
        "loadOnInit": [{ type: Input },],
        "showOptions": [{ type: Input },],
        "zoomInButton": [{ type: Input },],
        "zoomOutButton": [{ type: Input },],
        "showPDFOnlyOption": [{ type: Input },],
        "primaryColor": [{ type: Input },],
        "buttonsColor": [{ type: Input },],
        "buttonsHover": [{ type: Input },],
        "defaultDownloadName": [{ type: Input },],
        "rotateRightTooltipLabel": [{ type: Input },],
        "rotateLeftTooltipLabel": [{ type: Input },],
        "resetZoomTooltipLabel": [{ type: Input },],
        "fullscreenTooltipLabel": [{ type: Input },],
        "zoomInTooltipLabel": [{ type: Input },],
        "zoomOutTooltipLabel": [{ type: Input },],
        "downloadTooltipLabel": [{ type: Input },],
        "showPDFOnlyLabel": [{ type: Input },],
        "openInNewTabTooltipLabel": [{ type: Input },],
        "enableTooltip": [{ type: Input },],
        "onNext": [{ type: Output },],
        "onPrevious": [{ type: Output },],
    };
    return ImageViewerComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var ImageViewerModule = (function () {
    function ImageViewerModule() {
    }
    /**
     * @return {?}
     */
    ImageViewerModule.forRoot = /**
     * @return {?}
     */
    function () {
        return {
            ngModule: ImageViewerModule,
        };
    };
    ImageViewerModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule
                    ],
                    declarations: [
                        ImageViewerComponent
                    ],
                    exports: [
                        ImageViewerComponent,
                    ]
                },] },
    ];
    return ImageViewerModule;
}());

export { ImageViewerModule, ImageViewerComponent };
