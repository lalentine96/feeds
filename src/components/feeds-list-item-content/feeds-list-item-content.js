import React, { Component } from 'react';
import Markdown from 'react-markdown';

import './feeds-list-item-content.css';

const ContentLinkRenderer = ({ href, children }) => {
    return (
        <a 
            href={href} 
            target="_blank"
            rel="noopener noreferrer" >
            {children}
        </a>
    );
}

const ContentItemRenderer = ({ index, children }) => {
    let className = 'feeds-list-item-content-p';
    if (index && index > 2) {
        className += ' feeds-list-item-content-p-hidden'
    }
    return (
        <div className={className}>
            {children}
        </div>
    );
};

const ContentListRenderer = ({ index, children }) => {
    return (
        <ContentItemRenderer index={index}>
            <ul>{children}</ul>
        </ContentItemRenderer>
    );
};

export default class FeedsListItemContent extends Component {

    state = {
        hidden: true,
    }

    markdownRenderers = {
        link: ContentLinkRenderer,
        paragraph: ContentItemRenderer,
        list: ContentListRenderer
    };

    isPostBig = (this.props.text.split(`\n\n`).length > 3);

    onToggleHidden = () => {
        this.setState(({ hidden }) => {
            return {
                hidden: !hidden
            };
        });
    };

    render() {
        const { text, title, resource_url: resource } = this.props;
        const { hidden } = this.state;

        return (
            <div className="card-body">
                <h4 className="card-title">{title}</h4>
                <Markdown 
                    source={text}
                    renderers={this.markdownRenderers}
                    includeNodeIndex={hidden}
                />
                {
                    resource.indexOf('https://www.reddit.com') !== 0 &&
                    <ContentItemRenderer>
                        <ContentLinkRenderer href={resource}>
                            See this post on <strong>{resource.split('/')[2]}</strong>.
                        </ContentLinkRenderer>
                    </ContentItemRenderer>
                }
                {
                    this.isPostBig &&
                    <div className="text-center show-more-block">
                        <button 
                            className="btn btn-light"
                            onClick={this.onToggleHidden} >
                            {`Show ${hidden ? 'more' : 'less'}`}
                        </button>
                    </div>
                }
            </div>
        );
    } 
};