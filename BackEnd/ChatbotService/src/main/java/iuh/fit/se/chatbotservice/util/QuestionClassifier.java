//package iuh.fit.se.chatbotservice.util;
//
//import org.springframework.stereotype.Component;
//
//import java.util.HashMap;
//import java.util.Map;
//
//@Component
//public class QuestionClassifier {
//
//    public boolean isDatabaseQuery(String question) {
//        // Logic đơn giản: kiểm tra các từ khóa liên quan đến database
//        String[] databaseKeywords = {"select", "from", "where", "join", "database", "table", "column"};
//        String lowerCaseQuestion = question.toLowerCase();
//
//        for (String keyword : databaseKeywords) {
//            if (lowerCaseQuestion.contains(keyword)) {
//                return true;
//            }
//        }
//        return false;
//    }
//
//    public String detectIntent(String question) {
//        // Detect intent based on keywords
//        if (question.toLowerCase().contains("tour")) {
//            return "tour_query";
//        } else if (question.toLowerCase().contains("location")) {
//            return "location_query";
//        }
//        return "unknown";
//    }
//
//    public Map<String, String> extractEntities(String question) {
//        // Extract entities like tour name or location
//        Map<String, String> entities = new HashMap<>();
//        if (question.toLowerCase().contains("tour")) {
//            entities.put("table", "tours");
//            if (question.toLowerCase().contains("price")) {
//                entities.put("column", "price");
//            }
//        } else if (question.toLowerCase().contains("location")) {
//            entities.put("table", "locations");
//        }
//        return entities;
//    }
//}
