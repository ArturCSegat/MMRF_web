export class PathTxtFileWriter {
    
    constructor(filename){
        this.filename = filename;
        this.file_content_string = "";
        this.nodes = [];
        this.nodes_string = "";
        this.node_edges = [];
        this.node_edges_string = "";
        this.edge_counter = 0;
    }


    // hanldes writing a node to the file
    writeNode(node){
        if (this.nodes.includes(node.id)){
            throw "node in file already";
        }
        const node_string = `${node.id}\t\t${node.lat}\t\t${node.lng}\n`;
        this.nodes_string += node_string;
        this.nodes.push(node.id);
    }


    // handle writing all the egdes from a given node
    writeEdgesFromNode(node){
        if (this.node_edges.includes(node.id)){
            throw "already calculated node_edges from node";
        }
        node.neighbours.forEach(neigh => {
            const edge_string = `${node.id}\t\t${neigh}\n`;
            this.node_edges_string += edge_string;
            this.edge_counter += 1;
        })
        this.node_edges.push(node.id);
    }


    // given a set of many paths, will fill the file aproprialty
    // so downloadFile is ready to be called
    handleWritesFromPathingSet(path_set){
        if (this.file_content_string !== ""){
            this.file_content_string = "";      // if the file is not empry we should clear it
        }

        const len = path_set.length;    
        for (let i = 0; i<len; i++){
            const path = path_set[i];       // The following lines should fill the nodes_string and edges_string so they 
            path.Nodes.forEach(node => {    // are ready to be written to the file contents 
                try{
                    this.writeNode(node);
                } catch {
                    return; // works like a continue;
                }
                try{
                    this.writeEdgesFromNode(node);
                } catch {
                    return; // works like a continue;
                }
            });
        }

        // properly format the file contents
        this.file_content_string += `Nodes ${this.nodes.length}\n`;
        this.file_content_string += this.nodes_string;
        this.file_content_string += `Arcs ${this.edge_counter}\n`;
        this.file_content_string += this.node_edges_string;
    }


    // when called will download the file to the client
    downloadFile(){
        const a = document.createElement('a');
        const file = new Blob([this.file_content_string], {type: "text/plain"})
        a.href= URL.createObjectURL(file);
        a.download = this.filename;
        a.click();
        URL.revokeObjectURL(a.href);
    }
}
