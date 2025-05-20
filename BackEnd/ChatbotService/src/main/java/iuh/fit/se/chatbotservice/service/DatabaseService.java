//package iuh.fit.se.chatbotservice.service;
//
//import org.springframework.stereotype.Service;
//
//import java.sql.Connection;
//import java.sql.DriverManager;
//import java.sql.PreparedStatement;
//import java.sql.ResultSet;
//import java.sql.SQLException;
//import iuh.fit.se.chatbotservice.util.QuestionClassifier;
//import java.util.Map;
//
//@Service
//public class DatabaseService {
//
//    private static final String DB_URL = "jdbc:mariadb://localhost:3306/catalog_db?createDatabaseIfNotExist=true";
//    private static final String USER = "root";
//    private static final String PASSWORD = "root";
//
//    // Kết nối đến database
//    private Connection connect() throws SQLException {
//        return DriverManager.getConnection(DB_URL, USER, PASSWORD);
//    }
//
//    // Thực hiện truy vấn SELECT
//    public String executeQuery(String question) {
//        QuestionClassifier classifier = new QuestionClassifier();
//        String intent = classifier.detectIntent(question);
//        Map<String, String> entities = classifier.extractEntities(question);
//
//        String tableName = entities.get("table");
//        String column = entities.get("column");
//
//        if (tableName == null) {
//            return "Không thể xác định bảng từ câu hỏi.";
//        }
//
//        String query = "SELECT " + (column != null ? column : "*") + " FROM " + tableName;
//
//        StringBuilder result = new StringBuilder();
//        try (Connection connection = connect();
//             PreparedStatement statement = connection.prepareStatement(query);
//             ResultSet resultSet = statement.executeQuery()) {
//
//            int columnCount = resultSet.getMetaData().getColumnCount();
//
//            // Lấy dữ liệu từ ResultSet
//            while (resultSet.next()) {
//                for (int i = 1; i <= columnCount; i++) {
//                    result.append(resultSet.getString(i)).append(" ");
//                }
//                result.append("\n");
//            }
//        } catch (SQLException e) {
//            e.printStackTrace();
//            return "Lỗi khi thực hiện truy vấn: " + e.getMessage();
//        }
//        return result.toString();
//    }
//
//}
