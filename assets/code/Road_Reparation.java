import java.util.*;

class DSU{
    int[] parent;
    public DSU(int n) {
        parent = new int[n];
        for(int i = 0; i < n; i++)
            parent[i] = i;
    }
    int find(int a) {
        if(a != parent[a])
            parent[a] = find(parent[a]);
        return parent[a];
    }
    void union(int a, int b) {
        int pa = find(a), pb = find(b);
        if(pa < pb)
            parent[pb] = pa;
        else
            parent[pa] = pb;
    }
}

class Road_Reparation {
    int n, m;
    ArrayList<int[]> mst;
    int[][] edges = new int[m][3];

    int kruskal(int n, int m){
        DSU dsu = new DSU(n+1);
        mst = new ArrayList<>();
        Arrays.sort(edges, Comparator.comparingInt(a -> a[2]));
        int edgesum = 0;
        for(int i = 0; i < m; i++) {
            int a = edges[i][0], b = edges[i][1], w = edges[i][2];
            if(dsu.find(a) == dsu.find(b))
                continue;
            dsu.union(a, b);
            mst.add(new int[] {a, b, w});
            edgesum += w;
        }
        return edgesum;
    }

    public static void main(String[] args) {

    }
}