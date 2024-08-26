
interface IContent {
    type: 'video' | 'document';
    title: string;
    url: string;
    duration?: number; // Duration in seconds, optional for documents
}

interface IReturnContent {

        contents: IContent[];

}

export {IReturnContent}